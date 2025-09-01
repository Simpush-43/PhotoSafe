import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import LockerImage from "../assets/ChatGPT Image Jul 14, 2025, 11_32_11 PM.png";
import LogoApp from "../assets/ChatGPT Image Jul 16, 2025, 04_04_45 PM.png";
import Lock from "../assets/lock.gif";
import LockOpen from "../assets/lock (1).gif";
import UseAuthStore from "../AuthStore/UseAuthStore";
import ProfileImage from "../assets/reshot-icon-profile-image-SBDVTH9PEA (1).png";
const Landingpage = () => {
  const { user, fetchUser } = UseAuthStore();
  // list animation
  const containerVarients = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVarients = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0 },
  };
  // navbar animations
  const navbarContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.31,
      },
    },
  };

  const navbaritemVarients = {
    hidden: { opacity: 0, y: -60 },
    show: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  // logo text animations
  const LogoWordAnimations = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const logowords = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };
  // getting user from authstore
  useEffect(() => {
    fetchUser();
  }, []);
  // navigations
  const Navigate = useNavigate();
  const nvaigateToCreateAccount = () => {
    Navigate("/home/createacoount");
  };

  const handleProfileClick = () => {
    Navigate("/home/profile");
  };
  const HandleSendClick = () => {
    Navigate("/home/send");
  };
  return (
    <div className="flex h-screen w-screen bg-gradient-to-t from-sky-500 to-indigo-500 bg-cover items-center flex-col">
      {/* logo and login sign up  */}
      <div className="flex flex-row justify-between px-8 mt-4 items-center w-full ml-[40px] mr-[40px]">
        <div className="flex flex-row justify-center items-center gap-[10px]">
          <img
            src={LogoApp}
            alt="Loading... 📄"
            loading="lazy"
            className="h-[50px] w-[50px] rounded-[50%] "
          />
          <motion.div
            variants={LogoWordAnimations}
            initial="hidden"
            animate="show"
            className="text-white font-bold"
          >
            {["P", "h", "o", "t", "o", "S", "a", "f", "e"].map((text, idx) => (
              <motion.p className="inline-block" key={idx} variants={logowords}>
                {text}
              </motion.p>
            ))}
          </motion.div>
        </div>
        <motion.div
          variants={navbarContainer}
          initial="hidden"
          animate="show"
          className="text-white font-bold flex flex-row gap-[12px] justify-end mt-[20px]"
        >
          <motion.p
            variants={navbaritemVarients}
            className="hover:text-amber-500 hover:scale-[1.30] hover:cursor-pointer hover:underline underline-offset-4 decoration-white"
            onClick={HandleSendClick}
          >
            Send
          </motion.p>
          <motion.p
            variants={navbaritemVarients}
            className="hover:text-amber-500 hover:scale-[1.30] hover:cursor-pointer hover:underline underline-offset-4 decoration-white"
            onClick={nvaigateToCreateAccount}
          >
            Receive
          </motion.p>

          {/* Login / Profile */}
          {user ? (
            <img
              src={user.Profilepic || ProfileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer hover:scale-[1.2] transition-transform"
              onClick={handleProfileClick}
            />
          ) : (
            <motion.p
              variants={navbaritemVarients}
              className="hover:text-amber-500 hover:scale-[1.30] hover:cursor-pointer hover:underline underline-offset-4 decoration-white"
              onClick={nvaigateToCreateAccount}
            >
              Login
            </motion.p>
          )}
        </motion.div>
      </div>
      <div className="w-full flex items-start justify-center">
        {/* text area title */}
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-start p-4 text-white text-3xl mt-8 border-b-3"
        >
          PhotoSafe A <span className="text-green-600"> Safer</span> way to
          Share 📫
        </motion.h1>
      </div>

      {/* detail of website */}
      <div className="flex mt-[30px] justify-between flex-wrap items-center gap-[100px]">
        <div className="indent-[2px] text-wrap text-lg font-sans font-[600] text-left max-w-[500px] flex-1 min-w-[280px]">
          <p className="text-white">
            In the world of Misuse of images, we gave you full control over your
            images.
          </p>
          <p className="mt-[0.4px] text-white">You can: </p>
          <motion.ul
            className="list-inside space-y-0.5"
            variants={containerVarients}
            initial="hidden"
            animate="show"
          >
            {[
              "See who saw image ",
              "When saw image",
              "Can delete it making it one time ",
              "Prevent unwanted screenshots and many more... ",
            ].map((text, index) => (
              <motion.li
                key={index}
                variants={itemVarients}
                className="flex text-gray-800 hover:text-red-500 hover:scale-[1.02] transition-all duration-300 ease-in-out"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div>
          <img
            src={LockerImage}
            alt="Loading... 📄"
            loading="lazy"
            className="h-[300px] w-[300px] border-amber-50 border-2 rounded-[12px] hover:scale-[1.02] transition-transform duration-300 "
          />
        </div>
      </div>
      {/* send and reveice buttons */}
      <div className="flex gap-[50px] mt-[20px]">
        <button className="SendBtn">
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <img
                src={Lock}
                alt=""
                className="w-[30px] h-[30px] rounded-[50%]"
              />
            </div>
          </div>
          <button
            className="font-bold hover:text-green-500"
            onClick={HandleSendClick}
          >
            Send
          </button>
        </button>
        <button className="SendBtn">
          <div className="svg-wrapper-2">
            <div className="svg-wrapper">
              <img
                src={LockOpen}
                alt=""
                className="w-[30px] h-[30px] rounded-[50%]"
              />
            </div>
          </div>
          <button className="font-bold hover:text-green-500 ">Recieve</button>
        </button>
      </div>
    </div>
  );
};

export default Landingpage;
