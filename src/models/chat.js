
const mongoose = require('mongoose')
const {Schema} = mongoose

const messageSchema = new Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried : true,
    },
    text :{
        type : String,
        requried : true,
    },
} , {timestamps : true})

const chatSchema = new Schema({
    participants:[
        {type : mongoose.Schema.Types.ObjectId, ref:"User" , requried : true}
    ],
    messages: [messageSchema]
})

const Chat = mongoose.model('Chat' , chatSchema)
module.exports = {Chat}