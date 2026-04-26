
const validator = require('validator')
const validateSignupData = (req) =>{
    const {firstName , lastName , emailId , password} = req.body
    if(!firstName?.trim() || !lastName?.trim() || !emailId || !password){
        throw new Error("Signup requiremt are not fullfied");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not vlaid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong Password")
    }

}

module.exports = {
    validateSignupData
}
