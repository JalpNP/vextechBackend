import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Student from "../models/Student.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post("/", upload.single("student"), async (req, res) => {
  const { studentname, title, status } = req.body;
  const student = req.file?.filename || null;

  const newStudent = new Student({ studentname, title, student, status });
  await newStudent.save();
  res.status(201).json(newStudent);
});

router.put("/:id", upload.single("student"), async (req, res) => {
  try {
    const { studentname, title, status } = req.body;
    const studentId = req.params.id;

    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (req.file && existingStudent.student) {
      const oldImagePath = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "uploads", existingStudent.student);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    existingStudent.studentname = studentname;
    existingStudent.title = title;
    existingStudent.status = status;
    if (req.file) existingStudent.student = req.file.filename;

    const updatedStudent = await existingStudent.save();
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

export default router;
