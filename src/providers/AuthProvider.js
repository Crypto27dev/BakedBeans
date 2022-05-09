import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const AuthContext = createContext({
  address: null,
  connect: () => null,
  loading: false,
  disconnect: () => null,
  chainId: null,
  setSnackbar: () => null,
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      },
      network: "binance",
    },
  },
};

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
});

export const AuthProvider = ({ children }) => {
  const [address, setAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [chainId, setChainId] = useState(null);

  const subscribeProvider = (provider) => {
    provider.on("disconnect", (error) => {
      console.log(error);
      setChainId(null);
      setAddress(null);
    });
    provider.on("accountsChanged", (accounts) => {
      setAddress(accounts[0]);
      setSnackbar({
        type: "info",
        message: "Account Changed",
      });
    });
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      setChainId(chainId);
    });
  };

  const connect = async () => {
    if (address) {
      return;
    }
    setLoading(true);

    try {
      let web3 = new Web3(Web3.givenProvider);

      if (!web3.currentProvider) {
        setSnackbar({
          type: "error",
          message: '"No provider was found"',
        });
        return;
      }
      const provider = await web3Modal.connect();
      web3 = new Web3(provider);
      subscribeProvider(provider);

      const accounts = await web3.eth.getAccounts();
      const chain = await web3.eth.getChainId();
      setAddress(accounts[0]);
      setChainId(chain);
    } catch (err) {
      console.error(err);
      setSnackbar({
        type: "error",
        message: "Failed to connect",
      });
    }
    setLoading(false);
  };

  const disconnect = () => {
    web3Modal.clearCachedProvider();
    setAddress(null);
    setChainId(null);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{ address, loading, connect, disconnect, chainId, setSnackbar }}
    >
      {children}
      {snackbar && (
        <Snackbar
          open={!!snackbar}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          {
            <Alert
              onClose={handleClose}
              severity={snackbar?.type}
              sx={{ width: "100%" }}
            >
              {snackbar?.message}
            </Alert>
          }
        </Snackbar>
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
