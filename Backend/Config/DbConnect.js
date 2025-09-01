const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongooose connected with url: ${conn.connection.host}`);
  } catch (error) {
    console.error(`mongooose connection failed with error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
