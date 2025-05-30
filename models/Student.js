import mongoose from "mongoose";


const secondaryMongoURI = "mongodb+srv://vextech2025:vextech2025@vextech.pdqvgoh.mongodb.net/?retryWrites=true&w=majority&appName=vextech";

// Create a new connection instance for the secondary DB
const secondaryConnection = mongoose.createConnection(secondaryMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const StudentSchema = new mongoose.Schema({
  studentname: { type: String, required: true },
  title: { type: String, required: true },
  student: { type: String, required: true },
  status: { type: String, default: "Active" }
});


const Student = secondaryConnection.model("Student", StudentSchema);

export default Student;
