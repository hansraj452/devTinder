

 const adminAuth = (req , res , next) =>{
    console.log("admin is checking for the auth")
    const token = "xyz"
    const isAdimAuthAuthorized = token === "xyz"
    if(!isAdimAuthAuthorized){
         res.send("user is unauthorzied")
    }
    else{
       next()
    }
}

const userAuth = (req , res , next) =>{
    console.log("user is checking for the auth")
    const token = "xyz"
    const isAdimAuthAuthorized = token === "xyz"
    if(!isAdimAuthAuthorized){
         res.send("user is unauthorzied")
    }
    else{
       next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}