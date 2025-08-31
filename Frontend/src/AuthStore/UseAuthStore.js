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
      const { User, tokens } = res.data;
      set({ user: User, token: tokens.accessToken, loading: false });
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
      return {success:true};
    } catch (error) {
      set({
        error: error?.response?.data?.message || "SignUp failed",
        loading: false,
      });
      console.error("Signup Error:", error);
      return {success: false, message: error?.response?.data?.message || "Signup failed"}
    }
  },

  //signin 
  signin: async ({ Email, Password }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${BASE_URL}/signin`, { Email, Password });
      const { User, tokens } = res.data;
      set({ user: User, token: tokens.accessToken, loading: false });
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
      return {success: true};
    } catch (error) {
      set({
        error: error?.response?.data?.message || "SignIn failed",
        loading: false,
      });
      console.error("Signin Error:", error);
      return {success:false,message: error?.response?.data?.message || "SignIn failed"}
    }
  },

  //signout
  signout: ()=>{
    set({user:null,token:null});
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  },
  // handle googlecallback
handleGoogleCallback: async (serverResponse)=>{
  set({loading:true,error:null});
  try {
    const {user,tokens} = serverResponse;
    set({
      user,
      token:tokens.accessToken,
      loading:false,
    });
    sessionStorage.setItem("accessToken",tokens.accessToken);
    sessionStorage.setItem("refreshToken",tokens.refreshToken);
    return {success: true};
  } catch (error) {
    set({
        error: error?.response?.data?.message || "Google sign-in failed",
        loading: false,
      });
      console.error("Google Login Error:", error);
      return { 
        success: false, 
        message: error?.response?.data?.message || "Google sign-in failed"
      };
  }
},
// user 
fetchUser:async(userDetail)=>{
set({loading:true,error:null})
try {
  const token = sessionStorage.getItem("accessToken");
  if(!token) {
    set({user:null,loading:false})
    return
  }
  const res = await axios.get(`${BASE_URL}/me`,{
    headers:{Authorization: `Bearer ${token}`}
  })
  set ({user:res.data,loading:false})
} catch (error) {
        console.error("Fetch user error:", error);
      set({ user: null, error: "Failed to fetch user", loading: false });
}
},
// get all users
fetchallUsers: async()=>{
  set({loading:true,error:null})
  try {
    const token = sessionStorage.getItem("accessToken");
    if(!token){
    set({users:[],loading:false})
    return
    }
const res = await axios.get(`${BASE_URL}/users`,{
  headers:{Authorization:`Bearer ${token}`}
})
set({users:res.data,loading:false})
  } catch (error) {
    console.error("Fetch all users error:", error);
    set({ users: [], error: "Failed to fetch users", loading: false });
  }
},
// upload image
UploadImage: async (file)=>{
const token = sessionStorage.getItem("accessToken");
if(!token){
    console.info("You are not authorized user please login")
}else{
  const formdata = new FormData();
  console.log(formdata)
  formdata.append('image',file);
  for (let pair of formdata.entries()) {
  console.log(pair[0] + ": ", pair[1]);
}
  const res = await axios.post(`${BASE_URL}/upload`,formdata,{
    headers:{Authorization:`Bearer ${token}`,
  }
  }
);
console.log(res.data);
  return res.data

}
}
}));

export default UseAuthStore;
