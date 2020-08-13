const mongoose=require('mongoose');

const ReceiverSchema=new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    town:{
        type: String,
        required:true
    },
    country:{
        type: String,
        required:true
    },
    addressToShip: {
        type: String,
        required:true
    }
})

const Receiver=mongoose.model('receiver',ReceiverSchema);

module.exports=Receiver;