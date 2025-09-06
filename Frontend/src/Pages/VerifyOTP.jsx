import React, {useState,useEffect} from 'react'
import { useLocation ,useNavigate} from "react-router-dom";
import UseAuthStore from "../AuthStore/UseAuthStore";

const VerifyOTP = () => {
  const [otp,setotp]=useState('');
  const [userid,setuserid] = useState('')
  const location = useLocation();
  const navigate = useNavigate();
  const {VerifySignUpOTP, VerifyOtpLogin,user}= UseAuthStore();
  console.log(user)
  const userId = user.id||user._id;
  useEffect(()=>{
 if(user && user.id||user._id){
    setuserid(user.id||user._id);
  }
  },[user])
  const handleverification = async()=>{
        if (!userid || !otp) {
      alert("Please enter OTP or wait for userId");
      return;
    }
  if(location.state?.type === "signup" ){
   const result= await VerifySignUpOTP(otp,userId)
   if(result?.success){
navigate('/home')
   }
  }else if(location.state?.type === "signin"){
     const result = await VerifyOtpLogin(otp,userId);
        if(result?.success){
navigate('/home')
   }
  }
  }
  return (
    <div>
      <div>
      <input type="text" placeholder="Enter OTP" name='otp' onChange={(e)=>setotp(e.target.value)}/>
      <button onClick={handleverification}>Verify OTP</button>
    </div>
    </div>
  )
}

export default VerifyOTP
