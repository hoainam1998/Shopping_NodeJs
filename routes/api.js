const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DB = mongoose.connection;
const Customer = require('../models/customer_model');
const Products=require('../models/products_model');
const BillingDetail = require('../models/billingDetail_model');
const Receiver=require('../models/receiver_model');
const Bill=require('../models/bill_model');

router.get('/categories', (req, res) => {
    DB.collection('categories').find({}).toArray().then(result => {
        res.json(result);
    })
})

router.get('/products', (req, res) => {
    DB.collection('products').find({}).toArray().then(products => {
        res.json(products);
    })
})

router.get('/products/date', async (req, res) => {
    let products = await DB.collection('products').find({}).sort({ date: -1 }).limit(9).toArray();
    res.json(products);
})

router.get('/products/rated', async (req, res) => {
    let product = await DB.collection('products').find({ ratemark: { $gte: 6 } }).toArray();
    res.json(product);
})

router.get('/products/views', async (req, res) => {
    let product = await DB.collection('products').find({ view: { $gte: 20 } }).toArray();
    res.json(product);
})

router.get('/products/:categories', (req, res) => {
    DB.collection('products').find({ categories_id: req.params.categories }).toArray()
        .then(data => {
            res.status(200).json(data);
        })
})

// 5f03d44daf188a1cd4af2964

router.get('/products/item/:id', async (req, res) => {
    let product = await DB.collection('products').aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'categories_id',
                foreignField: '_id',
                as: 'categories'
            }
        },
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } }

    ]).toArray();
    res.json(product);
})

router.get('/items/:id_categories/:id_product', async function (req, res) {
    let products = await DB.collection('products').find({ categories_id: req.params.id_categories, _id: { $ne: mongoose.Types.ObjectId(req.params.id_product) } }).toArray();
    res.json(products);
})

router.get('/price', (req, res) => {
    DB.collection('products').find({}).project({ "price": 1, _id: 0 }).sort({ "price": -1 }).limit(1).toArray()
        .then(data => {
            res.json(data);
        })
})

DB.collection('products').createIndex({ name: 'text' });
let productSearch = [];
router.post('/search', async (req, res) => {
    productSearch = await DB.collection('products').find({ $text: { $search: req.body.search } }).toArray();
    res.json(productSearch);
})

router.get('/search', (req, res) => {
    res.status(200).json(productSearch);
})

router.delete('/destroyValueSearch', (req, res) => {
    productSearch = [];
    res.send('Got a DELETE request at /productsearch');
})

router.post('/customer', async (req, res) => {
    let { firstname, lastname, phone, email, town, country, address } = req.body.infor;
    let carts = req.body.carts;
    let mainTotal = req.body.mainTotal;
    let inforReceiver = req.body.inforReceiver;
    let note = req.body.note;

    let oldCustomer = await Customer.findOne({ email: email })
    let id_customer = "";
    if (oldCustomer === null) {
        id_customer = 'KH' + (await Customer.countDocuments({}) + 1)
        let newCustomer = {
            _id: id_customer, firstname,
            lastname, phone,
            email, town,
            country, address
        };
        Customer.create(newCustomer)
    } else {
        id_customer = oldCustomer._id;
        DB.collection('customers').updateOne({_id: id_customer},{$set:{
                phone,town,
                country,address
            }
        })
    }

    let id_receiver=null;
    if (inforReceiver !== undefined) {
        let { nameReceiver, phoneReceiver, emailReceiver, townReceiver, countryReceiver, addressReceiver } = inforReceiver;
        let receiverExisted=await Receiver.findOne({email:emailReceiver})

        if(receiverExisted===null){
            id_receiver="NN"+(await Receiver.countDocuments({})+1)

            let newInforReceiver = {
            _id:id_receiver,
            name:nameReceiver, 
            phone:phoneReceiver,
            email:emailReceiver, 
            town:townReceiver,
            country:countryReceiver, 
            addressToShip:addressReceiver
            }

            Receiver.create(newInforReceiver);
        }else {
            id_receiver=receiverExisted._id;
            DB.collection('receivers').updateOne({_id:receiverExisted._id},{$set:{
                name:nameReceiver,
                phone: phoneReceiver,
                town: townReceiver,
                country: countryReceiver,
                addressToShip: addressReceiver
                }
            })
        }
    }

    let newbill={
        _id:'HD'+(await Bill.countDocuments({})+1),
        note,
        total: mainTotal,
        customer_id: id_customer,
        receiver_id: id_receiver
    }

    Bill.create(newbill,function(err,data){
        if(err) throw err;
        let newBillingDetail = {
            products: carts,
            bill_id:data._id
        }

        BillingDetail.create(newBillingDetail,function(err,res){
            if(err) throw err;
            res.products.forEach(function(item){
                DB.collection('products').updateOne({_id: mongoose.Types.ObjectId(item.product_id)},
                    { $inc: {quanity: -item.quantityBought} }
                )
            })
        })
    });

    res.send(true);
})

router.delete('/removeAll/:dbTable',async (req,res)=>{

    await DB.collection(req.params.dbTable).deleteMany({});
    
    res.send('removed all');
})

module.exports = router;
