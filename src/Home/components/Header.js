import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import logo from "../../assets/FullLogo.png";
import Connect from "./Connect";

const Wrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  paddingBottom: 24,
  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

export default function Header() {
  return (
    <Wrapper>
      <img src={logo} alt="" width={"100%"} style={{ marginTop: -48 }} />
      <Connect responsive={false} />
      <Typography variant="h6" marginTop={-3}>
        The BNB Reward Pool with the tastiest daily return and lowest dev fee
      </Typography>
    </Wrapper>
  );
}
