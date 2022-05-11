import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import logo from "../../assets/FullLogo.png";
import Connect from "./Connect";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useState, useRef, useEffect } from 'react'

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

  const Ref = useRef(null);
  
  // The state for our timer
  const [timer, setTimer] = useState('0 D : 00 H : 00 M : 00 Sec');
  const [over, setOver] = useState(false);

  const getTimeRemaining = (e) => {

    let year = new Date().getFullYear();
    // let difference = +new Date(Date.UTC(2022, 4, 12, 16, 0, 0)) - +new Date();
    let difference = +new Date(Date.UTC(2022, 4, 11, 4, 37, 0)) - +new Date();

    if (over == true) return {
        total: 0, hours: 0, minutes: 0, seconds: 0, days: 0
    };

    const total = difference;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor((total / (1000 * 60 * 60 * 24)));
    return {
        total, hours, minutes, seconds, days
    };
  }


  const startTimer = (e) => {
      let { total, hours, minutes, seconds, days } = getTimeRemaining(e);
      if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) setOver(true);
      else {
          // update the timer
          // check if less than 10 then we need to 
          // add '0' at the begining of the variable
          setTimer(
              (days + ' D ') + ':' +
              (hours > 9 ? ' ' + hours + ' H ' : ' 0' + hours + ' H ') + ':' +
              (minutes > 9 ? ' ' + minutes + ' M ' : ' 0' + minutes + ' M ') + ':'
              + (seconds > 9 ? ' ' + seconds + ' Sec ' : ' 0' + seconds + ' Sec')
          )
      }
  }


  const clearTimer = (e) => {

      // If you try to remove this line the
      // updating of timer Variable will be
      // after 1000ms or 1sec
      //if (Ref.current) clearInterval(Ref.current);
      const id = setInterval(() => {
          startTimer(e);
      }, 1000)
      return () => clearInterval(id);
  }

  const getDeadTime = () => {
      let deadline = new Date();

      // This is where you need to adjust if 
      // you entend to add more time
      deadline.setSeconds(deadline.getSeconds() + 10);
      return deadline;
  }

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
      clearTimer(getDeadTime());
  }, []);

  return (
    <Wrapper>
      {over ? <div/> :
        <div style={{backgroundColor: "#e83446e6", borderRadius: "10px", padding:"10px", fontSize:"21px", boxShadow: "2px 5px 14px 4px #786a6ade", color: "white"}}>{timer}</div>
      }
      <img src={logo} alt="" width={"100%"} style={{ marginTop: "50px", marginBottom: "20px" }} />
      <Connect responsive={false} />
      <Box marginTop={3} marginBottom={3}>
        <Button
          variant="contained"
          fullWidth
          style={{backgroundColor: "#e83446"}}
          onClick={()=>{
            window.open("https://piston-token.com/swap", "_blank");
          }}
        >
          BUY PSTN
        </Button>
      </Box>
    </Wrapper>
  );
}
