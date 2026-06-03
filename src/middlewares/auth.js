
var jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async(req, res, next) => {
  try {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("Please Login!")
    }
    const decode = await jwt.verify(token , "DEV@TINDER$9970")
    const user = await User.findById(decode._id)
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next()
  } 
  catch (err) {
    res.status(400).send({
      "Error: " : err.message,
    });
  }
};

module.exports = {
  userAuth,
};
