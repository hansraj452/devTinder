const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./modles/user")

const app = express();


app.post("/signup" , async (req , res) =>{
    const user = new User({
        firstName : "Suma",
        last:"Tiwari",
        emailId : "suma@gamil.com",
        password :"sumasuma@1234"
    })
    const value = await user.save();
    res.status(200).json({userId : value._id , message : "User added successfully"})
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
