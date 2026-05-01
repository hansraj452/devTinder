
const express = require('express')
const User = require("../modles/user");
const { validateSignupData } = require("../utility/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");



const authRouter = express.Router();

//Signup api
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password, skill , age } = req.body;
    const passwrodHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwrodHash,
      skill ,
      age
    });
    const value = await user.save();
    res
      .status(200)
      .json({ userId: value._id, message: "User added successfully" });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// login api
authRouter.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswrodValid = await user.validatePassword(password)
    if (isPasswrodValid) {
      // create a JWT Token
      const token = await user.getJWT()
      // Add the token to the cookies and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.status(200).send({ message: "Singup/login is successfull" });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

authRouter.post('/logout' , (req ,res) =>{
    res.cookie("token" , null , { expires: new Date(Date.now()) })
    .send("User logout successfully")
})


module.exports = authRouter