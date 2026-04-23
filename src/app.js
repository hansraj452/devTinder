const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./modles/user");

const app = express();

// to parse the request body into js object we need one middleware i.e express.json it is an inbuild middleware and use with app.use() so it can handle all the methods

app.use(express.json());

// post api for the send data
app.post("/signup", async (req, res) => {
  // In Express, req.body is undefined by default because Express does not automatically parse the incoming request body. Instead, it treats the request body as a raw stream of data that must be read and converted into a usable JavaScript object by middleware before your route handler can access it.
  // console.log(req)

  const user = new User(req.body);
  const value = await user.save();
  res
    .status(200)
    .json({ userId: value._id, message: "User added successfully" });
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
app.patch("/user" , async(req , res) =>{
  try{
    const userId = req.body.userId
    const data = req.body
   const updatedata =  await User.findByIdAndUpdate(userId , data)
    res.send({message :"User Information updated successfully" , updatedata})
  }
  catch(err){
res.send({message :"Something went wrong "} , err )
  }
})

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
