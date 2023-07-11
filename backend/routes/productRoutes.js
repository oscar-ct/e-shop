import express from "express";
import {getAllProducts, getProductById, createProduct} from "../controllers/productController.js";
import {protect, admin} from "../middleware/authMiddleware.js";

// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

// router.route('/').get(getAllProducts);
router.get('/',getAllProducts);
router.get('/:id', getProductById);


// ADMIN ACCESS ONLY
router.post("/", protect, admin, createProduct);


export default router;