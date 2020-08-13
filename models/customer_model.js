const mongoose=require('mongoose');

const CustomerSchema=new mongoose.Schema({
    _id:{
        type: String,
        required:true
    },
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    town: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})

const Customer=mongoose.model('customer',CustomerSchema);

module.exports=Customer;