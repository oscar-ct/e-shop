import express from "express";
import {getAllProducts, getProductById} from "../controllers/productController.js";


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

// router.route('/').get(getAllProducts);
router.get('/',getAllProducts);
router.get('/:id', getProductById);


export default router;