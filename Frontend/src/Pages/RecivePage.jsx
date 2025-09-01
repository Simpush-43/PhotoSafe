import React, { useEffect } from "react";
import { useState } from "react";
import UseAuthStore from "../AuthStore/UseAuthStore";
import { AnimatePresence, motion, scale } from "framer-motion";
import ProfileImage from "../assets/reshot-icon-profile-image-SBDVTH9PEA (1).png";
const RecivePage = () => {
  const [selecteduser, setselecteduser] = useState(null);
  const [no_of_images, seno_of_images] = useState(0);
  const {
    user,
    fetchUser,
    users,
    fetchallUsers,
    UploadImage,
    GetALLImage,
    images,
  } = UseAuthStore();
  // get all users
  useEffect(() => {
    fetchallUsers();
    fetchUser();
  }, []);
  // get all images
  useEffect(() => {
    GetALLImage();
  }, []);
  console.log("All images", images);
  const currentUser = user;
  // function to send images
  const Imagesend = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("file is not present");
    }
    try {
      const res = await UploadImage(file);
      if (res?.imageUrl) {
        updateImageCount();
        console.log("Uploaded:", res.imageUrl);
      } else {
        console.error("imageUrl not found in response");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };
  const updateImageCount = () => {
    seno_of_images((prev) => prev + 1);
  };
  return (
    <div className="flex h-screen">
      {/* left siderbar */}
      <div className="w-1/4 bg-gray-700  border-r overflow-y-auto">
        <div className="p-4 font-bold text-lg font-sans text-white">Users</div>
        <div></div>
        <input
          type="text"
          placeholder=" 🔎Search the user..."
          className="w-full border-b-2 border-b-white text-amber-100"
        />
        <div className="space-y-2">
          {users && currentUser ? (
            users
              .filter((user) => user._id !== currentUser._id)
              .map((u) => (
                <motion.div
                  key={u.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer rounded-l-lg mt-[10px]"
                  onClick={() => setselecteduser(u)}
                >
                  <img
                    src={u.Profilepic || ProfileImage}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium text-lg font-sans text-amber-200">
                    {u.Firstname}
                  </span>
                </motion.div>
              ))
          ) : (
            <div className="loader">
              {" "}
              <div className="wrapper">
                <div className="circle"></div>
                <div className="line-1"></div>
                <div className="line-2"></div>
                <div className="line-3"></div>
                <div className="line-4"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {selecteduser ? (
            <motion.div
              key={selecteduser.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: "80" }}
              className="flex flex-col h-full"
            >
              {/* {header } */}
              <div className="flex items-center gap-2 p-[4px] border-b shadow-sm bg-amber-500">
                <img
                  src={selecteduser.Profilepic || ProfileImage}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <h2 className="font-medium text-lg font-sans text-amber-200">
                  {selecteduser.Firstname}
                </h2>
              </div>
              {/* Message area */}
              <div className="flex overflow-y-auto p-4 bg-gray-100">
                {no_of_images > 0 ? (
                  <p>No of images sent: {no_of_images}</p>
                ) : (
                  <p className="text-gray-500">No messages yet...</p>
                )}
                <div>
                  <p>Your sent image:</p>
                  {images && images.length > 0 ? (
                    images.map((i) => (
                      <img
                        key={i._id}
                        src={i.imageUrl}
                        alt="sent"
                        className="w-20 h-20 m-1 rounded"
                      />
                    ))
                  ) : (
                    <p>No images sent yet</p>
                  )}
                </div>
              </div>
              {/* Input */}
              <div className="p-2 border-t flex gap-2 bg-white">
                <input
                  type="file"
                  className="hidden"
                  id="imageUpload"
                  onChange={Imagesend}
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg"
                >
                  Upload 🗃️
                </label>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  Send 📩
                </button>
              </div>
            </motion.div>
          ) : (
            <div>
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center flex-1 text-gray-500"
              >
                Select a user to start sending...
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecivePage;
