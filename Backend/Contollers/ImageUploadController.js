const cloudinary = require('cloudinary');
const multer = require('multer');
const {CloudinaryStorage} =require('multer-storage-cloudinary');
const Image = require('../Models/ImageDetailSchema');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios')
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
// creating cloudinary config
cloudinary.config({
  cloud_name:'PhotoSafe',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  // differnt parameters
  params:{
folder:'uploads',
allowed_formats:['jpg','png','jpeg',]
  }
});
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 4 } }).single('image');
// save the uploads
const ImageUpload = (req,res)=>{
  console.log("swagat hai ")
upload(req,res ,async(err)=>{
  if (err) {
  console.error("multer/cloudinary error:", err);
  return res.status(500).json({ success: false, message: err.message });
}
      console.log("file mila:", req.file);
    console.log("body mila:", req.body);
    if (!req.file) {
      return res.status(400).json({ success:false, message: "No file uploaded" });
    }

  try {
    const UserId = req.user.id || req.user._id;
    const imageUrl = req.file.path;
    // save the image 
    const newImage = await Image.create({user:UserId,imageUrl});
    res.status(200).json({success:true,imageUrl:newImage.imageUrl})
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Upload failed' });
  }
})
}
module.exports = ImageUpload