const mongoose=require('mongoose');

const BillingDetail=new mongoose.Schema({
    products:[{
        _id:false,
        product_id: String,
        quantityBought: Number,
        total:Number
    }]
    ,
    bill_id:{
        type: String,
        required: true,
        ref: 'bills'
    }
})

const billingDetail=mongoose.model('billing_detail',BillingDetail);

module.exports=billingDetail;