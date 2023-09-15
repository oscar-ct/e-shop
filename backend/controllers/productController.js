// *****  Mongoose Product model connected to DB  ******
import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


const getAllProducts = asyncHandler(async (req, res) => {
    let products;
// .find({}) - empty object will find all products
    const pageSize = req.query.searchTerm ||  req.query.sortByTerm ? 16 : 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.searchTerm || req.query.sortByTerm || "";
    // const sortTerm = req.query.sortByTerm === "toprated" ? {rating: -1} : req.query.sortByTerm === "latest" ? {createdAt: -1} : {createdAt: -1};
    const sortTerm = req.query.sortByTerm === "toprated" ? {rating: -1} : req.query.sortByTerm === "latest" ? {createdAt: -1} : req.query.sortByTerm === "price-asc" ? {price: +1} : req.query.sortByTerm === "price-dsc" ? {price: -1} : {createdAt: -1};
    const searchTerm = req.query.searchTerm ? { name: {$regex: req.query.searchTerm, $options: "i"} } : req.query.sortByTerm === "toprated" ? {rating: {$gt: 0}} : {};
    const count = await Product.countDocuments({...searchTerm});
    if (req.query.filterTerm && req.query.filterTerm !== "all") {
        products = await Product.find({...searchTerm}).where("category").equals(req.query.filterTerm.substring(0, 1).toUpperCase() + req.query.filterTerm.substring(1, req.query.filterTerm.length)).sort({...sortTerm}).limit(pageSize).skip(pageSize * (page-1));
        res.status(201);
        return res.json({products, page, pages: Math.ceil(count / pageSize), keyword: keyword});
    }
    products = await Product.find({...searchTerm}).sort({...sortTerm}).limit(pageSize).skip(pageSize * (page-1));
    res.status(201);
    return res.json({products, page, pages: Math.ceil(count / pageSize), keyword: keyword});
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
    const {name, brand, model, description, category, price, countInStock, images, color} = req.body;
    const newProduct = new Product({
        user: req.user._id,
        name: name,
        image: "/images/sample.jpg",
        brand: brand,
        category: category,
        model: model,
        description: description,
        rating: 0,
        color: color,
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
    const {name, price, model, color, description, brand, category, countInStock} = req.body;
    const productToEdit = await Product.findById(req.params.id);
    if (productToEdit) {
        productToEdit.color = color;
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

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product)  {
        await Product.deleteOne({_id: product._id});
        res.status(200).json({
            message: "Product deleted"
        });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const deleteProductImage = asyncHandler(async (req, res) => {
    const {imageId} = req.body;
    const product = await Product.findOneAndUpdate({_id: req.params.id}, {$pull: {images: {_id: imageId}}}, {returnDocument: "after"});
    if (product)  {
        res.status(200).json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment, title} = req.body;
    const product = await Product.findById(req.params.id);
    if (product)  {
        const alreadyReviewed = product.reviews.find(function(review) {
            return review.user.toString() === req.user._id.toString();
        });
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("You already reviewed this product!");
        }
        const review = {
            name: req.user.name,
            title,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        const totalRatings = product.reviews.reduce(function (acc, review) {
            return acc + review.rating;
        }, 0);
        product.rating = totalRatings/product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const deleteProductReview = asyncHandler(async (req, res) => {
    const {user, reviewId} = req.body;
    const userId = req.user._id;
    if (user === userId.toString()) {
        const updated = await Product.updateOne({_id: req.params.id}, {$pull: {reviews: {_id: reviewId}}});
        if (updated) {
            res.status(201).json({
                message: "Product review deleted"
            });
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    } else {
        res.status(400);
        throw new Error("You do not have permission to delete this review");
    }
});

const getProductsByRating = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(5);
    res.status(201);
    return res.json(products);
});

const getProductCategories = asyncHandler(async (req, res) => {
    const products = [];
    const categories = await Product.distinct("category").sort();
    for (let i = 0; i < categories.length; i++) {
        const product = await Product.where("category").equals(categories[i]).sort({rating: -1}).limit(1).select("images category");
        products.push(product[0]);
    }
    return res.status(201).json(products);
});


export {getAllProducts, getProductById, createProduct, updateProduct, updateProductImages, deleteProduct, deleteProductImage, createProductReview, deleteProductReview, getProductsByRating, getProductCategories};




// const product = products.find(function (product) {
//     return product._id === req.params.id;
// });