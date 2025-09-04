import React from 'react'
import { useLocation } from "react-router-dom";
import UseAuthStore from "../AuthStore/UseAuthStore";

const VerifyOTP = () => {
  const location = useLocation();
  const {VerifySignUpOTP, VerifyOtpLogin}= UseAuthStore();
  const handleverification = async()=>{
  if(location.state?.type === "signup" ){
    await VerifySignUpOTP()
  }else if(location.state?.type === "signin"){
    await VerifyOtpLogin()
  }
  }
  return (
    <div>
      <div>
      <input type="text" placeholder="Enter OTP" name='otp' />
      <button onClick={handleverification}>Verify OTP</button>
    </div>
    </div>
  )
}

export default VerifyOTP
