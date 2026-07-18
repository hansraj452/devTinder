const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const userSafeData = "photoURL firstName lastName age gender about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const allPendingReauest = await ConnectionRequest.find({
      toUserId: logedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName" , "age" , "gender" , "about" , "photoURL" , "skill"]);

    res
      .status(200)
      .json({ message: "Data fetched successfully", data: allPendingReauest });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // 1. Find all accepted requests where the user is either the sender or receiver
    const allConnectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    // 2. Map through the results
    const data = allConnectionRequests.map((row) => {
      /* 
         If I am the sender (fromUserId), I want to see the person I sent it to (toUserId).
         If I am the receiver (toUserId), I want to see the person who sent it to me (fromUserId).
      */
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) ||10
     limit = limit> 20 ? 20 : limit;
    const loggedInUser = req.user;
    const skip = (page-1)*limit
    const allConnectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    allConnectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.toUserId.toString());
      hideUserFromFeed.add(req.fromUserId.toString());
    });
    const user = await User.find({
      $and : [
        {_id : {$nin : Array.from(hideUserFromFeed)}},
        {_id : {$ne : loggedInUser._id}}
      ]
    }).skip(skip).limit(limit)
    res.status(200).json({message : "Feed data fetched sucessfully" , user});
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

//get User by Id
userRouter.get("/user/:id" , async(req , res) =>{
  const {id} = req.params;
  const user = await User.findById(id)
  if(!user){
     return res.status(400).json({message : "User not found"});
  }
  res.send(user);
})

module.exports = userRouter;
   