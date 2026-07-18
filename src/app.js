const express = require("express");
const connectDB = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const cors = require('cors')
const cronJob = require('./utility/cornJob');
const initializeSocket = require('./utility/socketIo')
const http = require('http');
const chatRoueter = require("./routes/chat");
require('dotenv').config()

const app = express();
const server = http.createServer(app);
initializeSocket(server)

// Middle ware
app.use(express.json());

app.use(cors({
  origin : 'http://localhost:5173',
  credentials : true,
  withCredentials : true
}));

app.use(cookieParser());

//auth api  like ( singup , login , logout)
app.use('/' , authRouter)

//profile router 
app.use('/' , profileRouter)

//request connection
app.use('/' , requestRouter)

//User router
app.use('/' , userRouter )

//payment router
app.use('/' , paymentRouter)

//chat 
app.use('/' , chatRoueter)

connectDB()
  .then(() => {
    console.log("DB Connected successfully");
    
    cronJob();

    server.listen(process.env.PORT, () => {
      console.log(`Server is on running port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Can not connect with db", error);
  });
