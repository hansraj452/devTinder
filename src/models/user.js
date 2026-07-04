const mongoose = require("mongoose");
const { Schema } = mongoose;
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [4, "First name must be at least 4 characters"],
      maxLength: [20, "First name must not exceed 20 characters"],
      trim:true
    },
    lastName: {
      type: String,
      trim : true
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error ("Invalid email addres: " + value)
        }
    }
    },
    password: {
      type: String,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Enter a strong password: " + value)
        }
      }
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender input is not valid");
        }
      },
    },

    isPremium :{
      type: Boolean,
      default : false,

    },
    
    memberShipType :{
      type : String,
    },

    photoURL: {
      type: String,
      default: "https://as1.ftcdn.net/v2/jpg/13/11/22/86/1000_F_1311228699_YoiLc5aJ3RWz3uRfdEtlV0UYSQjqf7RW.webp",
      validate(value){
        if(!validator.isURL(value)){
            throw new Error ("Invalid photo URl:" + value)
        }
      }
    },
    skill: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Skills must be between 1 and 5",
      },
    },
    about: { 
      type: String,
      default: "This about section is not defined by User",
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
   return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
  return isPasswordValid
}

// Model
const User = mongoose.model("User", userSchema);
module.exports = User;
