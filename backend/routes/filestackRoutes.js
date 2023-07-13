import express from "express";
import {encodeFileHandle, filestackToken} from "../controllers/filestackController.js";
import {protect, admin} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/handle", protect, admin, encodeFileHandle);
router.get("/token", protect, admin, filestackToken);

export default router;