const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Image = require("../Models/ImageDetailSchema");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });
// creating cloudinary config
cloudinary.config({
  cloud_name: "doc0lqjaf",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  // differnt parameters
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage }).single("image");
// save the uploads
const ImageUpload = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("multer/cloudinary error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    try {
      const SenderID = req.user.id || req.user._id;
      const { ReceiverID } = req.body;
      const imageUrl = req.file.path;
      const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min baad
      // save the image
      const newImage = await Image.create({
        SenderID: SenderID,
        imageUrl,
        expireAt,
        ReceiverID: ReceiverID,
      });
      res.status(200).json({ success: true, imageUrl: newImage.imageUrl });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });
};
const getAllimages = async (req, res) => {
  try {
    const { ReceiverID } = req.query;
    const images = await Image.find({ ReceiverID });
    res.status(200).json({ images });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch images", error: error.message });
    console.log(error.message);
  }
};
// get all images send to user
const ReceiveImages = async (req, res) => {
  try {
    const { SenderID,ReceiverID } = req.query;
    const images = await Image.find({ SenderID: SenderID,ReceiverID:ReceiverID })
      .populate("SenderID", "Firstname")
      .sort({ CreatedAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to recieve images", error: error.message });
    console.log(error.message);
  }
};
module.exports = { ImageUpload, getAllimages, ReceiveImages };
