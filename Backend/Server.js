const express = require('express')
const dotenv = require('dotenv')
const userRoutes = require('./Routes/UserRoutes')
const ImageRoutes = require('./Routes/ImageSendRoute')
const connectDB = require('./Config/DbConnect')
const cors = require('cors');
const session = require('express-session');
const passport = require('passport')
// dotenv config
dotenv.config()
// db connection
connectDB();
const app = express();
// port
const PORT = process.env.APP_PORT || 1000

// Correct middleware order starts here:
// 1. Body parsers first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Then, CORS
app.use(cors());

// 3. Then, session and passport
app.use(session({
    secret: process.env.CLIENT_SECRET || 'apple',
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false}
}));
app.use(passport.initialize())
app.use(passport.session())

// 4. Finally, your router
app.use('/api',userRoutes);
app.use('/api',ImageRoutes)
// A test route for the server
app.use('/server',(req,res)=>{
    res.json('hello from server')
})

app.listen(PORT,()=>{
    try {
        console.log(`Server started at ${PORT}`)
    } catch (error) {
        console.error('error in connecting to the server',error)
    }
})