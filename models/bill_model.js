const mongoose=require('mongoose');

const BillSchema=new mongoose.Schema({
    _id: {
        type: String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    },
    total:{
        type: Number,
        required:true
    },
    note:{
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true,
        ref: 'customers'
    },
    receiver_id: {
        type: String,
        default: null,
        ref: 'receivers'
    }
})

const Bill=mongoose.model('bill',BillSchema);

module.exports=Bill;