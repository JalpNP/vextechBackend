import express from "express";
import LandingText from "../models/landingText.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await LandingText.findOne();
  res.json(data);
});

router.put("/", async (req, res) => {
  const { text } = req.body;
  let existing = await LandingText.findOne();

  if (existing) {
    existing.text = text;
    await existing.save();
  } else {
    await LandingText.create({ text });
  }

  res.json({ message: "Landing text updated." });
});

export default router;
