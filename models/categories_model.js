const mongoose=require('mongoose');

const CategoriesSchame=new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    categories_name: {
        type: String,
        required:true
    },
    imagesCategories: {
        type: String,
        required:true
    }
})

const Categories=mongoose.model('categories',CategoriesSchame);

module.exports=Categories;