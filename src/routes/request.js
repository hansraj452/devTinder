const { userAuth } = require("../middlewares/auth");
const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { validateStatus } = require("../utility/validation");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, touserId } = req.params;
      const fromUserId = req.user._id;
      const toUserId = touserId;

      const validUserRequest = await ConnectionRequest.findById(touserId)
      if(validUserRequest){
        return res.status(404).json({message : "No User Found with given Id"})
      }

      if(fromUserId === toUserId){
        throw new Error("Can not send request to it self")
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
             {fromUserId, toUserId},
             {fromUserId : touserId , touserId : fromUserId}
        ]
      })

      if(existingConnectionRequest){
        return res.status(401).json({message : "A connection request already exist" , status : existingConnectionRequest.status }
        )
      }
      validateStatus(status)
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request Sent Successfully",
        data,
      });
    } catch (err) {
      res.status(400).send({
        Error: err.message,
      });
    }
  }
);

module.exports = requestRouter;
