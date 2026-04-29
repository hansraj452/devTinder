const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./modles/user");
const { validateSignupData } = require("./utility/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

// Middle ware
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwrodHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwrodHash,
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

app.post("/login", async (req, res) => {
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
      res.status(200).send({ message: "Singup is successfull" });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: "User login is successfull", user });
  } catch (err) {
    res.status(400).send({
      "Error: ": err.message,
    });
  }
});

app.post("/connectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: user.firstName + " send the connection request" });
  } catch (err) {
    res.status(400).send({
      Error: err.message,
    });
  }
});

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
