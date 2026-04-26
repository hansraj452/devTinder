const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./modles/user");


const app = express();

// to parse the request body into js object we need one middleware i.e express.json it is an inbuild middleware and use with app.use() so it can handle all the methods

app.use(express.json());

// post api for the send data
app.post("/signup", async (req, res) => {
  try{
  // In Express, req.body is undefined by default because Express does not automatically parse the incoming request body. Instead, it treats the request body as a raw stream of data that must be read and converted into a usable JavaScript object by middleware before your route handler can access it.
  // console.log(req)


//   if (req.body?.skill.length > 5) {
//   return res.status(400).json({ message: "Only five skills are allowed" });
// }
  const user = new User(req.body);
  const value = await user.save();
  res
    .status(200)
    .json({ userId: value._id, message: "User added successfully" });
  }
  catch(err){
     res.status(400).json({
      message: err.message
    });

  }  
});

//feed api i.e get all the data
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({ message: "Data get successfully", user });
  } catch (err) {
    res.send.json({ message: "something went worng" });
  }
});

//Creating an get api which will give user based on email
app.get("/user", async (req, res) => {
//  User can add unlimited data in the array so we need to apply the validiton so user can enter only five skills
  try {
    const emailId = req.body;
    const user = await User.find(emailId);
    res.send({ message: "User found successfully", user });
  } catch (err) {
    res.send({ message: "something went worng", err });
  }
});


//delete User
app.delete("/user", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

//update the user 
// user can update any thing we have to restrict the user to change some specific things like 
app.patch("/user/:userId", async (req, res) => {
  const ALLOWED_UPDATES = ["firstName" , "lastName" , "age" , "photoURL" , "skill" ]
 // each will return you boolean value using which we check that update is allowed or not
//  object.keys(data) ==> this will take the key of the req.body then we will apply each 

  // const userId = req.body.userId;
  const userId = req.params?.userId
  const data = req.body;
  // api check there is an issue of undefined whar is user is not updating the skill so it will undefined
  if (req.body?.skill.length > 5) {
  return res.status(400).json({ message: "Only five skills are allowed" });
} 
  
  const isUpdateAllow = Object.keys(data).every((k) =>{
     return ALLOWED_UPDATES.includes(k)
  })

  if(!isUpdateAllow){
    throw new Error("update not allowed")
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      message: "User information updated successfully",
      data: user
    });

  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
      error: err.message
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
