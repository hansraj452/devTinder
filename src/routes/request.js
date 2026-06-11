const { userAuth } = require("../middlewares/auth");
const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const {
  validateStatus,
  allowedActionStatus,
} = require("../utility/validation");
const User = require("../models/user");
const requestRouter = express.Router();
const sendEmail = require("../utility/sendEmail");

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, touserId } = req.params;
      const fromUserId = req.user._id;
      const toUserId = touserId;
      const validUserRequest = await User.findById(toUserId);
      if (!validUserRequest) {
        return res.status(404).json({ message: "No User Found with given Id" });
      }
     if (fromUserId.toString() === toUserId.toString()) {
  throw new Error("Cannot send request to yourself");
}

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(401).json({
          message: "A connection request already exist",
          status: existingConnectionRequest.status,
        });
      }

      validateStatus(status);
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      const emailRes = await sendEmail.run(
        `A New friend Request is received from ${req.user.firstName} ${req.user.lastName}`,
        `${req.user.firstName} ${req.user.lastName} sent you a connection request`,
      );
      res.json({
        message: "Connection Request Sent Successfully ",
        data,
      });
    } catch (err) {
      res.status(400).send({
        Error: err.message,
      });
    }
  },
);

//response of the request status
requestRouter.post(
  "/request/review/:status/:requestid",
  userAuth,
  async (req, res) => {
    try {
      const logInUser = req.user;
      const { status, requestid } = req.params;
      allowedActionStatus(status);
      const isValidRequestId = await ConnectionRequest.findOne({
        _id: requestid,
        toUserId: logInUser._id,
        status: "interested",
      });
      if (!isValidRequestId) {
        return res.status(404).json({
          message: "No connection Request found",
        });
      }
      isValidRequestId.status = status;
      const newStatus = await isValidRequestId.save();
      res
        .status(200)
        .json({ message: `Connection Request is ${newStatus.status}` });
    } catch (err) {
      res.status(400).send({ Error: err.message });
    }
  },
);

module.exports = requestRouter;
