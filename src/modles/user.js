const mongoose = require("mongoose");
const { Schema } = mongoose;
var validator = require("validator");

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
    photoURL: {
      type: String,
      default: "https://pixabay.com/images/search/profile%20icon/",
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

// Model
const User = mongoose.model("User", userSchema);
module.exports = User;
