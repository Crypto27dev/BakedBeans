
import { config } from "../../config";
import esIcon from "../assets/bscscan.png";
import tgIcon from "../assets/Telegram.png";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
  marginBottom: 24,
});

const tokenomics = [
  {
    label: "- Rewards can be re-invested & withdrawn daily",
  },
  {
    label: "- To ensure the max rewards (8%) we recommend the following strategy:"
  },
  {
    label: " - Re-Fuel 6 Days/Week and Collect 1 Day/Week",
  },
  {
    label: " - This has proven to be the best strategy to maximize your return of investment in the short term and in the long term",
  },
];

export default function Footer() {
  return (
    <>
    <Grid container justifyContent="center" spacing={2} marginTop={4}>
      <Grid item>
        <a href={config.scanLink} target="__blank">
          <img src={esIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
      <Grid item>
        <a href="https://t.me/PistonMinerOfficial" target="__blank">
          <img src={tgIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
    </Grid>
    <Grid container marginTop={6} style={{paddingLeft: "16px", paddingRight: "16px", color: "#193d7d"}}>
      <div style={{fontSize: "25px", color: "#193d7d", borderBottom: "5px solid", width: "100%", paddingBottom: "10px"}}>
        Tokenomics
      </div>
      <Box paddingTop={2}>
        {tokenomics.map((f) => (
          <Grid container key={f.label} justifyContent="space-between">
            <Typography variant="body1" gutterBottom style={{fontSize: "18px", color: "#193d7d", width: "100%", paddingBottom: "5px"}}>
              {f.label}
            </Typography>
          </Grid>
        ))}
        <Grid container >
          <Typography variant="body1" gutterBottom style={{fontSize: "19px", color: "#193d7d", width: "100%", paddingTop: "15px", paddingBottom: "5px", textAlign: "center"}}>
            Please note: You can not unstake; only withdraw earnings. Standard PSTN fees apply.
          </Typography>
        </Grid>
      </Box>
    </Grid>
    </>
  );
}
