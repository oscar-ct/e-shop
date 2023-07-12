// *****  Mongoose Product model connected to DB  ******
import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import crypto from "crypto";

const getAllProducts = asyncHandler(async (req, res) => {

// .find({}) - empty object will find all products
    const productsFromDB = await Product.find({})

    return res.json(productsFromDB);
});



const getProductById = asyncHandler(async (req, res) => {
//  *****  this try/catch allows custom error message with assist from errorHandler
    try {
        const singleProductFromDB = await Product.findById(req.params.id);
        return res.json(singleProductFromDB);
    } catch (e) {
        res.status(404);
        throw new Error("Product id not found!! " + e);
    }
// *****  this conditional fails to handle else  *****
// if (singleProductFromDB !== null) {
//     return res.json(singleProductFromDB);
// } else {
//     res.status(404);
//     throw new Error("Sorry, product id not found!! ");
// }
});


const createProduct = asyncHandler(async function (req, res) {
    const newProduct = new Product({
        user: req.user._id,
        name: "Sample Name Created On July 11, 2023",
        image: "/images/sample.jpg",
        brand: "Sample Brand",
        category: "Sample Category",
        model: "Sample Model",
        description: "Sample description from the backend lol ;)",
        rating: 0,
        numReviews: 0,
        price: 0.99,
        countInStock: 0,
        reviews: [],
    });
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async function (res, req) {
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const productToEdit = await Product.findById(req.params.id);
    if (productToEdit) {
        productToEdit.name = name;
        productToEdit.price = price;
        productToEdit.description = description;
        productToEdit.image = image;
        productToEdit.brand = brand;
        productToEdit.category = category;
        productToEdit.countInStock = countInStock;

        const updatedProduct = await productToEdit.save();
        res.status(200).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("No product found");
    }
});



export {getAllProducts, getProductById, createProduct, updateProduct};




// const product = products.find(function (product) {
//     return product._id === req.params.id;
// });