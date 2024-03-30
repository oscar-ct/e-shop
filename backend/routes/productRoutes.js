import express from "express";
import {
    getAllProducts,
    getAllProductsByAdmin,
    getProductById,
    createProduct,
    updateProduct,
    updateProductImages,
    deleteProduct,
    deleteProductImage,
    createProductReview,
    deleteProductReview,
    getProductsByRating,
    getProductCategories,
} from "../controllers/productController.js";
import {protect, admin} from "../middleware/authMiddleware.js";

// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

// router.route('/').get(getAllProducts);
router.get('/',getAllProducts);
router.get('/top', getProductsByRating);
router.get('/categories', getProductCategories);
router.get('/product/:id', getProductById);

router.post("/product/:id/reviews", protect, createProductReview);
router.delete("/product/:id/reviews", protect, deleteProductReview);

// ADMIN ACCESS ONLY
router.get('/admin', protect, admin, getAllProductsByAdmin);
router.post("/", protect, admin, createProduct);
router.put("/product/:id", protect, admin, updateProduct);
router.put("/product/:id/images", protect, admin, updateProductImages);
router.delete("/product/:id", protect, admin, deleteProduct);
router.delete("/product/:id/images", protect, admin, deleteProductImage);


export default router;