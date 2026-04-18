

const express = require('express')

const app = express();


// app.use() can handle all kind of routes like post get delete and updadte and patch.

// In single router multile routes can be send but if we not return form the first route then it will hang into the first route and send error in the response
app.use('/user' , (req , res , next) =>{
    console.log("handle route one ")
    // if we rmove the  res.send from the first router response then it will hang.
    // to pass the contorl to the next router we need one more parameter in the router handler that is next() function 
    // res.send("response 1 is send")
    next()
},
(req , res) =>{
console.log("handle router  two")
res.send("response 2 is send")
}
)

app.use("/test" , (req , res , next) =>{
 console.log("first router is executed")
//  res.send("response 1")
 next()
},

//corner case is missing 

(req , res , next) =>{
    console.log("second router is executed")
    res.send("response 2")
    next();
}

)

app.use("/second" , (req , res , next ) =>{
    console.log("first get have contorl")
    next()
})

app.use("/second" , (req , res) =>{
    console.log("second get router have control")
    res.send("response second is send");
})


//for error handing we use err in the router handler or callback function 1st parameter will be err , 2nd - req , 3rd - res , 4th next() but for the best pratice we try and catch to handle the error
app.use("/" , (err , req , res , next) =>{
    if(err){
        res.status(500).send("something went worng")
    }
})

// we can pass the mutile route handler in to an array [(req, res) ={res.send("1")} , (req , res) =>{res.senn("2")} , (req , res)=>{ res.send(req, res)}]

app.listen('8000' , () =>{
    console.log(`Server is on running port ${8000}`)
})

