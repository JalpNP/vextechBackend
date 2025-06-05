import express from "express";
import multer from "multer";
import { storage } from "../middlewares/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path }); // Cloudinary image URL
});

export default router;
