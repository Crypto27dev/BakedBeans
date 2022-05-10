/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";

import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";
import tokenAbI from "../../contracts/pstnabi.json";

const CardWrapper = styled(Card)({
  background: "#193d7d",
  color:"#ffffff",
  marginBottom: 24,
});

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BakeCard() {
  const { pstncontract, contract, wrongNetwork, getPSTNBalance, getPSTNApproved, fromWei, toWei, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractPSTN, setContractPSTN] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    pstn: 0,
    beans: 0,
    rewards: 0,
    approved: 0,
  });
  const [bakeBNB, setBakeBNB] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();

  const fetchContractPSTNBalance = () => {
    if (!web3 || wrongNetwork) {
      setContractPSTN(0);
      return;
    }
    getPSTNBalance(config.contractAddress).then((amount) => {
      setContractPSTN(fromWei(amount));
    });
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        pstn: 0,
        beans: 0,
        rewards: 0,
        approved: 0,
      });
      return;
    }

    try {
      const [bnbAmount, beansAmount, rewardsAmount, approvedAmount] = await Promise.all([
        getPSTNBalance(address),
        contract.methods
          .getMyMiners(address)
          .call()
          .catch((err) => {
            console.error("myminers", err);
            return 0;
          }),
        contract.methods
          .beanRewards(address)
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
          getPSTNApproved(address),
      ]);
      setWalletBalance({
        pstn: fromWei(`${bnbAmount}`),
        beans: beansAmount,
        rewards: fromWei(`${rewardsAmount}`),
        approved: approvedAmount
      });
    } catch (err) {
      console.error(err);
      setWalletBalance({
        pstn: 0,
        beans: 0,
        rewards: 0,
        approved: 0,
      });
    }
  };

  useEffect(() => {
    fetchContractPSTNBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = (value) => {
    setBakeBNB(value);
  };

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0xF4cA0A121cc5845E76135a8F0C05B462b164dE0e";
    return ref;
  };

  //////// -------------
  const approvePstn = async () => {
    setLoading(true);
    const ref = getRef();

    // var BigNumber = web3.utils.BN;
    var amount = web3.utils.toWei("100000000000", "ether");

    try {
      await pstncontract.methods.approve("0x7E0e935bfDb6A4e274f93Fa0f9a1Ef51FF400491", amount).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    // fetchWalletBalance();
    // fetchContractPSTNBalance();
    setLoading(false);
  };

  //////--------------------
  const bake = async () => {
    setLoading(true);

    const ref = getRef();
    const amount = toWei(`${bakeBNB}`);

    try {
      await contract.methods.buyEggs(ref, amount).send({
        from: address,
        value: 0,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractPSTNBalance();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.hatchEggs(ref).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);

    try {
      await contract.methods.sellEggs().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractPSTNBalance();
    setLoading(false);
  };

  return (
    <CardWrapper>
      {loading && <LinearProgress />}
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Contract</Typography>
          <Typography variant="h5">{contractPSTN} PSTN</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Wallet</Typography>
          <Typography variant="h5">{walletBalance.pstn} PSTN</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Your GAS</Typography>
          <Typography variant="h5">{walletBalance.beans} GAS</Typography>
        </Grid>
        <Box paddingTop={4} paddingBottom={3}>
          <Box>
            <PriceInput
              max={+walletBalance.pstn}
              value={bakeBNB}
              onChange={(value) => onUpdateBakeBNB(value)}
            />
          </Box>
          <Box marginTop={3} marginBottom={3}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBNB === 0 || loading || +walletBalance.approved != 0}
              onClick={approvePstn}
            >
              APPROVE
            </Button>
          </Box>
          <Box marginTop={3} marginBottom={3}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBNB === 0 || loading || +walletBalance.approved === 0}
              onClick={bake}
            >
              BUY GAS
            </Button>
          </Box>
          <Divider />
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography variant="body1" fontWeight="bolder">
              Your Rewards
            </Typography>
            <Typography variant="h5" fontWeight="bolder">
              {walletBalance.rewards} PSTN
            </Typography>
          </Grid>
          <ButtonContainer container>
            <Grid item flexGrow={1} marginRight={1} marginTop={3}>
              <Button
                variant="contained"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={reBake}
              >
                RE-FUEL
              </Button>
            </Grid>
            <Grid item flexGrow={1} marginLeft={1} marginTop={3}>
              <Button
                variant="contained"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={eatBeans}
              >
                COLLECT
              </Button>
            </Grid>
          </ButtonContainer>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
