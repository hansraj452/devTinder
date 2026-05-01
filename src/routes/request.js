
const { userAuth } = require("../middlewares/auth");
const express = require('express')

const requestRouter = express.Router();

requestRouter.post("/connectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: user.firstName + " send the connection request" });
  } catch (err) {
    res.status(400).send({
      Error: err.message,
    });
  }
});

module.exports = requestRouter