const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../Models/UserDetailSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const sendMail = require('../Utilits/SendMail')
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

// token generation
function generateToken(user) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "10d" }
  );
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "10m",
  });
  return { accessToken, refreshToken };
}

// sign up controller
exports.Signup = async (req, res) => {
  try {
    const { Firstname, Lastname, Email, Password, Age } = req.body;
    // check if user exists
    const Existinguser = await User.findOne({ Email });
    if (Existinguser) {
      return res
        .status(400)
        .json({ message: "User Already Exist,Please login" });
    }

    // creating user
    const Newuser = new User({
      Firstname,
      Lastname,
      Email,
      Password,
      Age: Number(Age),
    });
    // generate otp
    const otp = Math.floor(1000+Math.random()*9000);
    Newuser.otp = otp; // saving the otp in db
    Newuser.otpExpiry = Date.now() + 5 *60*1000 // 5 minutes
    await Newuser.save();
    await sendMail(Email,otp);
    res.status(201).json({
      message: "User signed up succefully",
      User: { id: Newuser._id, Firstname, Lastname, Email, Age },
    });
  } catch (error) {
    console.error("Signup controller error:", error);
    console.error("Error message:", error.message);
    // Log the error stack trace
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ message: "error in logging in", error: error.message });
  }
};

// login controller
exports.Signin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    // check user
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    // check password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      console.log("password is not match")
      return res.status(400).json({ message: "Invalid credentials!" });
    }else{
      console.log("password is mathched")
    }
    // generate otp
    const otp = Math.floor(1000+Math.random()*9000);
    user.otp = otp; // saving the otp in db
    user.otpExpiry = Date.now() + 5 *60*1000 // 5 minutes
    await user.save();
    await sendMail(Email,otp)
    // passing the user
    res.status(200).json({
      message: "user logged in succesfully",
      user: { id: user._id, Email: user.Email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in logging in", error: error.message });
  }
};
// verify otp 
exports.VerifyOtp = async(req,res)=>{
  try {
    console.log('welcome to here ')
    const {id,otp} = req.body;
    const user = await User.findById(id);
    if(!user) return res.status(500).json({message:"user doesnt exists"});
    if(user.otp !== Number(otp)) return res.status(400).json({message:"invalid otp"});
    if(user.otpExpiry < Date.now()) return res.status(404).json({message:"otp has expired"})
      const {accessToken,refreshToken} = generateToken(user);
    await user.save();
        res.status(200).json({
        message: "Login successful",
        tokens: { accessToken, refreshToken },
        user: { id: user._id, Email: user.Email },
      });
  } catch (error) {
    console.log("error in otp verification",error.message);
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
}
exports.fetchAlluser = async (req, res) => {
  try {
    const users = await User.find({}, "-Password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
    console.log(error.message);
  }
};

exports.handleGoogleCallback = async (req, res) => {
  try {
    const { access_token } = req.body || {};
    if (!access_token) {
      console.error("No access token received in request body.");
      return res.status(400).json({ message: "Access token is missing." });
    }
    const googleUserInfo = await axios.get(`${process.env.userInfoGoogle}`, {
      headers: { Authorization: `Bearer ${access_token.trim()}` },
    });
    const { email, given_name, family_name, picture } = googleUserInfo.data;

    // find or create user
    let user = await User.findOne({ Email: email });
    if (!user) {
      user = await User.create({
        Email: email,
        Firstname: given_name,
        Lastname: family_name || "",
        Password: "-google-auth-" + Math.random().toString(36).slice(-8),
        Age: 13,
        Profilepic: picture,
      });
    }
    if (!user.Profilepic) {
      user.Profilepic = picture;
      await user.save();
    }
    const { accessToken, refreshToken } = generateToken(user);
    res.status(200).json({
      message: "Successfully authenticated with Google",
      user: {
        id: user._id,
        email: user.Email,
        firstname: user.Firstname,
        lastname: user.Lastname,
        Profilepic: user.Profilepic,
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({
      message: "Failed to authenticate with Google",
      error: error.message,
    });
  }
};
