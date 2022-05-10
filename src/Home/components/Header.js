import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import logo from "../../assets/FullLogo.png";
import Connect from "./Connect";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

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

  let navigate = useNavigate();

  const gotoBuySite = () => {
    let path = `https://github.com`; 
    navigate(path);
  }
  return (
    <Wrapper>
      <img src={logo} alt="" width={"100%"} style={{ marginTop: "50px", marginBottom: "20px" }} />
      <Connect responsive={false} />
      <Box marginTop={3} marginBottom={3}>
        <Button
          variant="contained"
          fullWidth
          style={{backgroundColor: "#e83446"}}
          onClick={()=>{
            window.open("http://google.com", "_blank");
          }}
        >
          BUY SPIN
        </Button>
      </Box>
    </Wrapper>
  );
}
