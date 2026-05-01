const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateUpdateProfileData,
  passwordUpdateValidator,
} = require("../utility/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const profileRouter = express.Router();

//get the profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: "User login is successful", user });
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});

// edit the profile by patch
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUpdateProfileData(req)) {
      throw new Error("Invalid Edit request");
    }

    const logInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      logInUser[key] = req.body[key];
    });

    await logInUser.save();

    res.json({
      message: `${logInUser.firstName}, your profile is updated successfully`,
      data: logInUser,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//update the password
profileRouter.patch("/profile/updatepassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, newPassword } = req.body;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
      message: "Invalid current password",
    });
    }
    passwordUpdateValidator(req);
    const updatedPasswordHash = await bcrypt.hash(newPassword , 10)
    user.password = updatedPasswordHash
    await user.save()
    res.cookie("token" , null , {expires : new Date(Date.now())})
    res.status(200).json({
    message: "Password updated successfully and you can relogin again",
  });
  
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = profileRouter;
