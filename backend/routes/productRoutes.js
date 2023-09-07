import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductImages,
    deleteProduct,
    deleteProductImage,
    createProductReview,
    deleteProductReview,
    getProductsByRating,
} from "../controllers/productController.js";
import {protect, admin} from "../middleware/authMiddleware.js";

// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

// router.route('/').get(getAllProducts);
router.get('/',getAllProducts);
router.get('/top', getProductsByRating);
router.get('/:id', getProductById);

router.post("/:id/reviews", protect, createProductReview);
router.delete("/:id/reviews", protect, deleteProductReview);

// ADMIN ACCESS ONLY
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.put("/:id/images", protect, admin, updateProductImages);
router.delete("/:id", protect, admin, deleteProduct);
router.delete("/:id/images", protect, admin, deleteProductImage);


export default router;