const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DB = mongoose.connection;

router.get('/', (req, res) => {
    res.render('home.ejs')
});

router.get('/shop', (req, res) => {
    res.render('shop.ejs');
})

router.get('/productDetail',(req,res)=>{
    res.render('product.ejs');
})

router.get('/shopping/cart',(req,res)=>{
    res.render('shoppingCart.ejs');
})

router.get('/billingDetail',(req,res)=>{
    res.render('billingDetail');
})

router.get('/contact',(req,res)=>{
    res.render('contactUs');
})

module.exports = router;