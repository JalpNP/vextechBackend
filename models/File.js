import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  // Personal Information
  name: { type: String, required: true },
  mobile: { type: String, required: true }, // Changed to String to match form
  dob: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true }, // Added
  email: { type: String, required: true },
  
  // Address Information
  permanentadd: { type: String, required: true },
  presentadd: { type: String, required: true },
  pincode: { type: String, required: true },
  
  // Education Information
  institutename: { type: String, required: true },
  education: { type: String, required: true },
  currentstatus: { type: String, required: true },
  
  // Internship Information
  techopted: { 
    type: String, 
    required: true,
    enum: [
      "Frontend Development Internship",
      "Backend Development Internship",
      "Fullstack Development Internship",
      "MERN Stack Development Internship",
      "UI/UX Design Internship",
      "Data Analysis Internship",
      "App Development Internship",
      "Cyber Security Internship",
      "PHP Development Internship",
      "Python Internship",
      "AI/ML Internship"
    ]
  },
  duration: { type: String, required: true },
  startDate: { type: String, required: true }, // Added from form
  endDate: { type: String, required: true },   // Added from form
  
  // Financial Information
  fees: { type: Number, required: true },
  pendingfees: { type: Number, required: true },
  referedby: { type: String, required: true },
  
  // Documents
  photo: { type: String, required: true },
  aadhar: { type: String, required: true },
  
  // Offer Letter Fields
  internshipDate: String,
  startDate: String,
  responsibilities: String,
  returnBy: String,
  offerStatus: {
    type: String,
    enum: ["offered", "pending"],
    default: "pending",
  },
  
  // Review Fields
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["reviewed", "unreviewed"],
    default: "unreviewed",
  },
  
  // Completion Letter Fields
  completionDate: String,
  completionTo: String,
  completionName: String,
  completionStartDate: String,
  completionEndDate: String,
  workSummary: String,
  performance: String,
  appreciation: String,
  completionStatus: {
    type: String,
    enum: ["sent", "pending"],
    default: "pending",
  }
}, { 
  timestamps: true,
});

const File = mongoose.model('File', fileSchema);

export default File;