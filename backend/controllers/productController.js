// *****  Mongoose Product model connected to DB  ******
import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


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

export {getAllProducts, getProductById};




// const product = products.find(function (product) {
//     return product._id === req.params.id;
// });