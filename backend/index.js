import express from 'express';
import products from './data/products.js';
import dotenv from 'dotenv';
dotenv.config();


const port = process.env.PORT || 8080;

const app = express();


app.get('/', function (request, response) {
    response.send("API is running!!!");
});

app.get('/api/products', function (req, res) {
    res.json(products);
});


app.get('/api/products/:id', function (req, res) {
    const product = products.find(function (product) {
        return product._id === req.params.id;
    });
    res.json(product);
})

app.listen(port, function () {
    console.log("Server is active on port " + port);
});