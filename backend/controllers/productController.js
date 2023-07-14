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


// const createProduct = asyncHandler(async function (req, res) {
//     const newProduct = new Product({
//         user: req.user._id,
//         name: "Sample Name Created On July 11, 2023",
//         image: "/images/sample.jpg",
//         brand: "Sample Brand",
//         category: "Sample Category",
//         model: "Sample Model",
//         description: "Sample description from the backend lol ;)",
//         rating: 0,
//         numReviews: 0,
//         price: 0.99,
//         countInStock: 0,
//         reviews: [],
//     });
//     const createdProduct = await newProduct.save();
//     res.status(201).json(createdProduct);
// });

const createProduct = asyncHandler(async function (req, res) {
    const {name, brand, model, description, category, price, countInStock, images} = req.body;
    const newProduct = new Product({
        user: req.user._id,
        name: name,
        image: "/images/sample.jpg",
        brand: brand,
        category: category,
        model: model,
        description: description,
        rating: 0,
        numReviews: 0,
        price: price,
        countInStock: countInStock,
        reviews: [],
        images: images,
    });
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async function (req, res) {
    const {name, price, model, description, brand, category, countInStock} = req.body;
    const productToEdit = await Product.findById(req.params.id);
    if (productToEdit) {
        productToEdit.name = name;
        productToEdit.brand = brand;
        productToEdit.model = model;
        productToEdit.price = price;
        productToEdit.description = description;
        productToEdit.category = category;
        productToEdit.countInStock = countInStock;
        if (req.body.images) {
            productToEdit.image = req.body.image;
        }
        const updatedProduct = await productToEdit.save();
        res.status(200).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("No product found");
    }
});

const updateProductImages = asyncHandler(async (req, res) => {
    const {handle, url} = req.body;
    const image = {
        url: url,
        handle: handle,
    }
    const product = await Product.findById(req.params.id);
    if (product)  {
        if (product.images.length === 0) {
            product.images = [image]
            const updatedProduct = await product.save();
            res.status(201);
            res.json(updatedProduct);
        } else {
            product.images = [...product.images, image];
            const updatedProduct = await product.save();
            res.status(201);
            res.json(updatedProduct);
        }
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});


export {getAllProducts, getProductById, createProduct, updateProduct, updateProductImages};




// const product = products.find(function (product) {
//     return product._id === req.params.id;
// });