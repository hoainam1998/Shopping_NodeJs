const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const Product=require('./models/products_model.js');
const Categories=require('./models/categories_model.js');

const app = express();

//DB config
const db = require('./config/connectDB').MongoURI;

//Connect to db
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongoose connected'))
    .catch(err => console.log(err))

const DB = mongoose.connection;

const productsJson = JSON.parse(fs.readFileSync(__dirname + '/products.json', 'utf-8'));
const categoriesJson = JSON.parse(fs.readFileSync(__dirname + '/categories.json', 'utf-8'));

function insertValue() {
    Categories.insertMany(categoriesJson)
        .then(() => {
            Product.insertMany(productsJson)
                .then(() => console.log('inserted value'));
        })
}

// Categories.remove({});
// Product.remove({});

Categories.countDocuments({}).then((categoriesCount) => {
    Product.countDocuments({}).then((productsCount) => {
        if (categoriesCount === 0 && productsCount === 0) {
            insertValue();
        }
    })
})

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

app.use(express.static(path.join(__dirname, '/')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
});
