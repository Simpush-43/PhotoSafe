const mongoose = require('mongoose');

// creating a image schema 
const ImagedetailSchema = new mongoose.Schema({
  imageUrl:{
    type:String,
  },
  CreatedAt :{
    type:String,
    default:Date.now()
  },
  Expirytime :{Type:Number}
})
// Creating index for image auto delete
ImagedetailSchema.index({
  CreatedAt:1
},{expireAfterSeconds:0})