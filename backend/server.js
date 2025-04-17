const express=require('express')
const dotenv=require('dotenv');
const connectDB=require('./config/db')
const cors = require('cors');
const expenseRoute=require('./routes/expenseRoutes')
const profileRoutes = require("./routes/profile");
const session = require('express-session');

dotenv.config();
const app=express();
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  }));
app.use(express.urlencoded({ extended: true }));
// Define the PORT variable
const PORT = process.env.PORT || 8800;
const userRoute=require('./routes/authRoutes')
//connect to mongodb
connectDB();

app.use(express.json());
app.use('/userAuth',userRoute)
app.use('/expense',expenseRoute)
app.use("/profile", profileRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT,()=>{
    console.log("Backend server is running on port ",PORT);
    
})