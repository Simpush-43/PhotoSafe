import { create } from "zustand";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
console.log(BASE_URL);
const UseAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  //signup

  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/signup`, userData);
      set({ loading: false ,user:res.data.User});
      return { success: true, message: res.data.message,id:res.data.User.id };
    } catch (error) {
      set({
        error: error?.response?.data?.message || "SignUp failed",
        loading: false,
      });
      console.error("Signup Error:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Signup failed",
      };
    }
  },

  // otp verification
  VerifySignUpOTP: async (otp,id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/verify-signup-otp`, { otp,id });
      const { user, tokens } = res.data;
      set({ user: user, token: tokens.accessToken, loading: false });
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
      return { success: true };
    } catch (error) {
      set({
        error: error?.response?.data?.message || "otp verication failed",
        loading: false,
      });
      console.error("otp veriifcation Error:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "otp verication failed",
      };
    }
  },

  //signin
  signin: async ({ Email, Password }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/signin`, { Email, Password });
      set({ loading: false ,user:res.data.user});
      return { success: true, message: res.data.message,id:res.data.user.id};
    } catch (error) {
      set({
        error: error?.response?.data?.message || "SignIn failed",
        loading: false,
      });
      console.error("Signin Error:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "SignIn failed",
      };
    }
  },
  // signin otp 
  VerifyOtpLogin: async(otp,id)=>{
    set({loading:true,error:null})
    try {
      const res = await axios.post(`${BASE_URL}/verify-login-otp`, { otp,id});
      const { user, tokens } = res.data;
      set({ user: user, token: tokens.accessToken, loading: false });
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
      return { success: true };
    } catch (error) {
      set({
        error: error?.response?.data?.message || "otp verication failed",
        loading: false,
      });
      console.error("otp veriifcation Error:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "otp verication failed",
      };
    }
  },
  //signout
  signout: () => {
    set({ loading: true, error: null });
    try {
      set({ user: null, token: null });
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      return { success: true };
    } catch (error) {
      set({
        error: error?.response?.data?.message || "logout failed",
        loading: false,
      });
      console.error("logout Error:", error?.response?.data?.message);
      return {
        success: false,
        message: error?.response?.data?.message || "logout failed",
      };
    }
  },
  // handle googlecallback
  handleGoogleCallback: async (serverResponse) => {
    set({ loading: true, error: null });
    try {
      const { user, tokens } = serverResponse;
      set({
        user,
        token: tokens.accessToken,
        loading: false,
      });
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
      return { success: true };
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Google sign-in failed",
        loading: false,
      });
      console.error("Google Login Error:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Google sign-in failed",
      };
    }
  },
  // user
  fetchUser: async (userDetail) => {
    set({ loading: true, error: null });
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        set({ user: null, loading: false });
        return;
      }
      const res = await axios.get(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      console.error("Fetch user error:", error);
      set({ user: null, error: "Failed to fetch user", loading: false });
    }
  },
  // get all users
  fetchallUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        set({ users: [], loading: false });
        return;
      }
      const res = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: res.data, loading: false });
    } catch (error) {
      console.error("Fetch all users error:", error);
      set({ users: [], error: "Failed to fetch users", loading: false });
    }
  },
  // upload image
  UploadImage: async (file, ReceiverID) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.info("You are not authorized user please login");
    } else {
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("ReceiverID", ReceiverID);
      const res = await axios.post(`${BASE_URL}/upload`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    }
  },
  // get all images
  GetALLImage: async (ReceiverID) => {
    set({ loading: true, error: null });
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        set({ images: [], loading: false });
        res.json({ message: "You are not authorized please login" });
        return;
      } else {
        const res = await axios.get(
          `${BASE_URL}/images?ReceiverID=${ReceiverID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set({ images: res?.data.images, loading: true });
      }
    } catch (error) {
      console.error("Fetch all images error:", error);
      set({ images: [], error: "Failed to fetch images", loading: false });
    }
  },
  // Receive ALL images
  ReceiveALLImage: async (SenderID, ReceiverID) => {
    if (!SenderID) {
      console.info("Sender id is missing");
    }
    set({ loading: true, error: null });
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        set({ images: [], loading: false });
        res.json({ message: "You are not authorized please login" });
        return;
      } else {
        const res = await axios.get(
          `${BASE_URL}/images/receive?SenderID=${SenderID}&ReceiverID=${ReceiverID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set({ images: res?.data.images, loading: true });
      }
    } catch (error) {
      console.error("Fetch all images error:", error);
      set({ images: [], error: "Failed to fetch images", loading: false });
    }
  },
}));

export default UseAuthStore;
