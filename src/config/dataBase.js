

const mongoose = require("mongoose")

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://phantomprince6386_db_user:PQSFWV3lZCLHBgjj@nodejs.cu2c0kt.mongodb.net/devTinder')
}


module.exports = connectDB;


