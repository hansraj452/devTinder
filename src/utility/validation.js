
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


const allowedFieldUpdat = ["firstName","lastName","skill","photoURL",  "age"];
const validateUpdateProfileData = (req) => {
  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedFieldUpdat.includes(key)
  );

  if (!isUpdateAllowed) return false;

  if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
    throw new Error("Photo url is not valid");
  }

  return true;
};

const passwordUpdateValidator = (req) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    throw new Error("Both current and new password are required");
  }

  if (password === newPassword) {
    throw new Error("New password must be different from old password");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Password is not strong enough");
  }
};

const allowedStatus = ["ignored" , "interested"]
const validateStatus = (status) =>{
  if(!allowedStatus.includes(status)){
    throw new Error("Inavlid status")
  }
  return true
}

module.exports = {
    validateSignupData,
    validateUpdateProfileData,
    passwordUpdateValidator,
    validateStatus
}
