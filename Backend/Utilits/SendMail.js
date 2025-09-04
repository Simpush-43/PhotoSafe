const nodemailer = require('nodemailer');
const User = require('../Models/UserDetailSchema');
require("dotenv").config();
//  create a transporter
  const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"tpsingh02101966@gmail.com",
   pass:"nigphfgmeojbnulq"
  }
  })
const sendMail = async(Email,otp)=>{
try {
const user = await User.findOne({Email})
  // mail options 
  const mailoptions = {
    from:"tpsingh02101966@gmail.com",
    to: user.Email,
    subject:"Two step verification OTP",
    text:`Thanks for logging into PhotoSafe here is your two step verification please enter this to verify ${otp}`
  }
  const res = await transporter.sendMail(mailoptions);
  console.log("Email sent successfully:", res.response);
} catch (error) {
  console.log("Error sending email:", error);
}
}
module.exports = sendMail;