const express = require("express");
const connectDB = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

const app = express();

// Middle ware
app.use(express.json());
app.use(cookieParser());
//auth api  like ( singup , login , logout)
app.use('/' , authRouter)

//profile router 
app.use('/' , profileRouter)

//request connection
app.use('/' , requestRouter)

//User router
app.use('/' , userRouter )

connectDB()
  .then(() => {
    console.log("DB Connected successfully");
    app.listen("8000", () => {
      console.log(`Server is on running port ${8000}`);
    });
  })
  .catch((error) => {
    console.log("Can not connect with db", error);
  });
