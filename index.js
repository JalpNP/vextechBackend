import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Contactroute from './routes/Contact.js';
import Attendancetroute from './routes/Attendance.js';
import Certiroute from './routes/Certi.js';
import Payroute from './routes/Payment.js';
import Passportroute from './routes/Passport.js';
import Fileroute from './routes/File.js';
import Birthroute from './routes/Birthday.js';
import Task from './routes/TaskRegister.js';

import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/studentRoutes.js';
import landingTextRoute from './routes/landingText.js';
import collegeRoutes from './routes/college.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));


app.use('/', Contactroute);
app.use('/', Attendancetroute);
app.use('/', Certiroute);
app.use('/', Payroute);
app.use('/', Passportroute);
app.use('/', Task);
app.use('/', Fileroute);
app.use('/', Birthroute);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads/Project_img', express.static('uploads/Project_img'));

app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/landing-text", landingTextRoute);
app.use("/api/colleges", collegeRoutes);
app.use('/api/projects', projectRoutes);

// Primary DB connection (from .env)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Primary MongoDB connected");

    // Start server only after primary DB connection is successful
    app.listen(process.env.PORT || 9000, () => {
      console.log(`Server running on port ${process.env.PORT || 9000}`);
    });
  })
  .catch((err) => console.error("Primary MongoDB connection error:", err));

// Secondary DB connection (direct string)
export const secondaryConnection = mongoose.createConnection(
  "mongodb+srv://vextech2025:vextech2025@vextech.pdqvgoh.mongodb.net/?retryWrites=true&w=majority&appName=vextech"
);

secondaryConnection.on('connected', () => {
  console.log('Secondary MongoDB connected');
});

secondaryConnection.on('error', (err) => {
  console.error('Secondary MongoDB connection error:', err);
});
