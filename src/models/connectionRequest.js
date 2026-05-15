const mongoose = require('mongoose');
const { schema } = require('./user');
const {Schema} = mongoose;

const connectionRequestSchema =  new Schema(
    {
    fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    status : {
        type : String ,
        enum :{
            values: ["ignored" , "interested" , "accepted" , "rejected"],
            message : `{VALUE} is not supported`
        },
        required : true
    }
    
},
{
    timestamps : true,
}

)

// pre is a kind of middle ware 
// connectionRequestSchema.pre("save", function (next) {
//     const connectionRequest = this;

//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//         return next(
//             new Error("Connection request cannot be sent to yourself!")
//         );
//     }

//     next();
// });
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = new mongoose.model('ConnectionRequest' , connectionRequestSchema);
module.exports = ConnectionRequest