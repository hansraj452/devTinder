

const express = require('express')

const app = express();

app.use('/' , (req , res)=>{
    res.send("THIS IS FIRST URL")
})

app.listen('8000' , () =>{
    console.log(`Server is on running port ${8000}`)
})

