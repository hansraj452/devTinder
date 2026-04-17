

const express = require('express')

const app = express();

//this will match all the the https methods api calls to /123
app.use('/123' , (req , res) =>{
    res.send("New route have been created for the /123")
})


//app.get will only look get api call methods and send their response 
app.get("/user" , (req , res)=>{
    res.send({firstName : "shyam" , last :"sharma"})
})

app.post("/user" , (req , res) =>{
    console.log("Data wil save to db")
    res.send({message:"Data saved successfully into the db"})
})



app.listen('8000' , () =>{
    console.log(`Server is on running port ${8000}`)
})

