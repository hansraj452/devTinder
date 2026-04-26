const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./modles/user");
const {validateSignupData} = require("./utility/validation")
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try{
  validateSignupData(req)
  const { firstName, lastName, emailId, password } = req.body;
  const passwrodHash = await bcrypt.hash(password, 10);
  const user = new User({
    firstName , 
    lastName ,
    emailId , 
    password : passwrodHash
  });
  const value = await user.save();
  res.status(200)
    .json({ userId: value._id, message: "User added successfully" });
  }
  catch(err){
     res.status(400).json({
      message: err.message
    });
  }  
});

app.post("/login" , async(req , res)=>{
  try{
    const {password , emailId} = req.body;
    const user = await User.findOne({emailId});
    console.log(user) 
    if(!user){
      throw new Error("Invalid Credentials")
    }
    const isPasswrodValid = await bcrypt.compare(password , user.password)
    if(isPasswrodValid){
      res.status(200).send({message :"Singup is successfull"})
    }
    else{
      throw new Error("Invalid Credentials")
    }
  }
  catch(err){
    res.status(400).json9({
      message : err.message
    })
  }

})

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
app.patch("/user/:userId", async (req, res) => {
  const ALLOWED_UPDATES = ["firstName" , "lastName" , "age" , "photoURL" , "skill" ]
  const userId = req.params?.userId
  const data = req.body;
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
