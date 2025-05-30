// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema({
//   name: String,
//   mobile: Number,
//   dob: Date,
//   email: String,
//   permanentadd: String,
//   presentadd: String,
//   pincode: String,
//   institutename: String,
//   education: String,
//   currentstatus: String,
//   techopted: String,
//   duration: String,
//   fees: Number,
//   pendingfees: Number,
//   referedby: String,
//   photo: String,
//   aadhar: String,
//   createdAt: { type: Date, default: Date.now },

//   description: {
//     type: String,
//     default: "",
//   },
//   status: {
//     type: String,
//     enum: ["reviewed", "unreviewed"],
//     default: "unreviewed",
//   },
// }, { timestamps: true });


// const File = mongoose.model('File', fileSchema);

// export default File;


// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema({
//   name: String,
//   mobile: Number,
//   dob: Date,
//   email: String,
//   permanentadd: String,
//   presentadd: String,
//   pincode: String,
//   institutename: String,
//   education: String,
//   currentstatus: String,
//   techopted: String,
//   duration: String,
//   fees: Number,
//   pendingfees: Number,
//   referedby: String,
//   photo: String,
//   aadhar: String,

//   // Newly added fields for offer letter
//   internshipDate: String,
//   startDate: String,
//   responsibilities: String,
//   returnBy: String,
//   offerStatus: {
//     type: String,
//     enum: ["offered", "pending"],
//     default: "pending",
//   },

//   description: {
//     type: String,
//     default: "",
//   },
//   status: {
//     type: String,
//     enum: ["reviewed", "unreviewed"],
//     default: "unreviewed",
//   },
// }, { timestamps: true });

// const File = mongoose.model('File', fileSchema);

// export default File;


import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  dob: Date,
  email: String,
  permanentadd: String,
  presentadd: String,
  pincode: String,
  institutename: String,
  education: String,
  currentstatus: String,
  techopted: String,
  duration: String,
  fees: Number,
  pendingfees: Number,
  referedby: String,
  photo: String,
  aadhar: String,

  // Fields for offer letter
  internshipDate: String,
  startDate: String,
  responsibilities: String,
  returnBy: String,
  offerStatus: {
    type: String,
    enum: ["offered", "pending"],
    default: "pending",
  },

  // Fields for review status
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["reviewed", "unreviewed"],
    default: "unreviewed",
  },

  // New fields for completion letter
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
  },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

export default File;
