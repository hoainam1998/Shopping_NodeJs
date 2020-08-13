const mongoose=require('mongoose');

const ProductSchema=new mongoose.Schema({
    // name , price , salePercent , description , weight , quanity , images , date , ratedmark , categories_id
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePercent: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    quanity: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    ratemark: {
        type: Number,
        required: true
    },
    view: {
        type: Number,
        required: true
    },
    categories_id: {
        type: String,
        required: true
    }
});

const Products=mongoose.model('products',ProductSchema);

module.exports=Products;