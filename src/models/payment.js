const mongoose = require('mongoose');

const {Schema} = mongoose

const paymentSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref : "User",
        require:true,
    },
    paymentId:{
        type: String,
    },
    orderId:{
        type:String,
        require:true,
    },
    status:{
        type: String,
        require: true,
    },
    amount:{
        type:Number,
        require: true,
    }, 
    currency:{
        type:String,
        require :true,
    },
    receipt:{
        type:String,
        required : true,
    }, 
    notes:{
        firstName:{
            type: String,
        },
        lastName:{
            type: String,
        }, 
        membershipType:{
            type:String,
            default :"standard"
        }
    }

},
{timestamps : true})

const Payments = mongoose.model('Payment' , paymentSchema );

module.exports = Payments