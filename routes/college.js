import express from "express";
import College from "../models/College.js";
import upload from "../middlewares/uploadCollegeImg.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all colleges
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.single("collage_img"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const collage_img = "/uploads/College_Slider_img/" + req.file.filename;
    const collage_name = req.body.collage_name;

    const newCollege = new College({ collage_name, collage_img });
    await newCollege.save();

    res.status(201).json(newCollege);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Edit college (update name and optionally update image)
router.put("/:id", upload.single("collage_img"), async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });

    // Delete old image if new one uploaded
    if (req.file && college.collage_img) {
      const oldPath = path.join(__dirname, "..", college.collage_img);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    college.collage_name = req.body.collage_name || college.collage_name;
    if (req.file) {
      college.collage_img = "/uploads/College_Slider_img/" + req.file.filename;
    }

    await college.save();
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete college and its image file
router.delete("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });

    const imagePath = path.join(__dirname, "..", college.collage_img);
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting image:", err);
    });

    await College.findByIdAndDelete(req.params.id);

    res.json({ message: "College deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
