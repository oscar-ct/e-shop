// *****  Mongoose Product model connected to DB  ******
import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// helper function
const capitalizeFirstChar = (string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1, string.length);
};

const getAllProducts = asyncHandler(async (req, res) => {
    // initialize products variable
    let products;
    // set number of products per page, search or sort queries will return 16 products, else only 8 (i.e. homepage)
    const pageSize = req.query.searchTerm || req.query.sortByTerm ? 16 : 14;
    // if page number exists from url search params, set page number, else set to 1
    const page = Number(req.query.pageNumber) || 1;
    // if url search params includes a search or sort or category parameter, set keyword/categoryTerm to that, else leave blank, this is used to update the title of the search or category page
    const keyword = req.query.searchTerm || req.query.sortByTerm || "";
    const categoryTerm = req.query.filterTerm || "";
    // if url sort param exists, sort by that params, else default to sort by newest to oldest
    const sortTerm = req.query.sortByTerm === "toprated" ? {rating: -1} : req.query.sortByTerm === "latest" ? {createdAt: -1} : req.query.sortByTerm === "price-asc" ? {price: +1} : req.query.sortByTerm === "price-dsc" ? {price: -1} : {createdAt: -1};
    // if url search param exists, filter by that search keyword param, else default to all i.e. {}
    const searchTerm = req.query.searchTerm ? { name: {$regex: req.query.searchTerm, $options: "i"}, isDisabled: false} : req.query.sortByTerm === "toprated" ? {rating: {$gt: 0}, isDisabled: false} : {isDisabled: false};
    // initialize count variable
    let count;
    // if category exists and category term does not equal all do this
    if (req.query.filterTerm && req.query.filterTerm !== "all") {
        // set count to the numbers of results found based on category parameter
        count = await Product
            .countDocuments({...searchTerm})
            .where("category")
            .equals(capitalizeFirstChar(req.query.filterTerm));
        // set products to query category parameter
        products = await Product
            .find({...searchTerm})
            .where("category")
            .equals(capitalizeFirstChar(req.query.filterTerm))
            .sort({...sortTerm})
            .limit(pageSize)
            .skip(pageSize * (page-1));
        // response status
        res.status(201);
        // return JSON to api call
        return res.json(
            {
                products,
                page,
                pages: Math.ceil(count / pageSize),
                keyword: keyword,
                categoryTerm: categoryTerm
            }
        );
    }
    // set count to the numbers of results found based on category parameter
    count = await Product.countDocuments({...searchTerm});
    // set products to query search parameter
    products = await Product
        .find({...searchTerm})
        .sort({...sortTerm})
        .limit(pageSize)
        .skip(pageSize * (page-1));
    // response status
    res.status(201);
    // return JSON to api call
    return res.json(
        {
            products,
            page,
            pages: Math.ceil(count / pageSize),
            keyword: keyword, categoryTerm: categoryTerm
        }
    );
});


const getAllProductsByAdmin = asyncHandler(async (req, res) => {
    const pageSize = 16;
    const page = Number(req.query.pageNumber) || 1;
    const sortTerm = {createdAt: -1};
    const searchTerm = req.query.searchTerm ? { name: {$regex: req.query.searchTerm, $options: "i"} } : {};
    const count = await Product.countDocuments({...searchTerm});
    // set products to query search parameter
    const products = await Product
        .find({...searchTerm})
        .sort({...sortTerm})
        .limit(pageSize)
        .skip(pageSize * (page-1));
    res.status(201);
    return res.json(
        {
            products,
            page,
            pages: Math.ceil(count / pageSize),
        }
    );
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
    const {name, price, model, color, description, brand, category, countInStock, isDisabled} = req.body;
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
        productToEdit.isDisabled = isDisabled
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
            const product = await Product.findById(req.params.id);
            product.numReviews = product.reviews.length;
            const totalRatings = product.reviews.reduce(function (acc, review) {
                return acc + review.rating;
            }, 0);
            product.rating = totalRatings/product.reviews.length;
            await product.save();
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


export {getAllProducts, getAllProductsByAdmin, getProductById, createProduct, updateProduct, updateProductImages, deleteProduct, deleteProductImage, createProductReview, deleteProductReview, getProductsByRating, getProductCategories};




// const product = products.find(function (product) {
//     return product._id === req.params.id;
// });