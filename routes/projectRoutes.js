import express from 'express';
import fs from 'fs';
import path from 'path';
import Project from '../models/Project.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// CREATE - Add new project with image upload
router.post('/add-project', upload.single('card_img'), async (req, res) => {
  try {
    const { overlay_text, project_title, project_desc, project_link } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newProject = new Project({
      card_img: `/uploads/Project_img/${req.file.originalname}`,
      overlay_text,
      project_title,
      project_desc,
      project_link,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Get all projects
router.get('/get-projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update a project by id with optional new image upload
router.put('/update-project/:id', upload.single('card_img'), async (req, res) => {
  try {
    const { overlay_text, project_title, project_desc, project_link } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // If new image uploaded, delete old one
    if (req.file && project.card_img) {
      const oldImagePath = path.join(__dirname, '..', project.card_img);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData = {
      overlay_text,
      project_title,
      project_desc,
      project_link,
      ...(req.file && { card_img: `/uploads/Project_img/${req.file.originalname}` }),
    };

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete a project by id and its image
router.delete('/delete-project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Delete image file
    const imagePath = path.join(__dirname, '..', project.card_img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project and image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// module.exports = router;

export default router;
