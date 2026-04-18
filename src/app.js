

const express = require('express')

const app = express();


// app.use() can handle all kind of routes like post get delete and updadte and patch.

// In single router multile routes can be send but if we not return form the first route then it will hang into the first route and send error in the response
app.use('/user' , (req , res) =>{
    console.log("handle route one ")
    // if we rmove the  res.send from the first router response then it will hang in the 
    // res.send("response 1 is send")
},
(req , res) =>{
console.log("handle router  two")
res.send("response 2 is send")
}

)

app.listen('8000' , () =>{
    console.log(`Server is on running port ${8000}`)
})

