const mongoose=require('mongoose');

const TestSchema=new mongoose.Schema({
    value:{
        type: Number,
        required:true
    }
})

const Test=mongoose.model('tests',TestSchema);

module.exports=Test;