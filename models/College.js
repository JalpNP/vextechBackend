import mongoose from "mongoose";

// Your secondary MongoDB URI
const secondaryMongoURI = "mongodb+srv://vextech2025:vextech2025@vextech.pdqvgoh.mongodb.net/?retryWrites=true&w=majority&appName=vextech";

// Create a new connection instance for the secondary DB
const secondaryConnection = mongoose.createConnection(secondaryMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const collegeSchema = new mongoose.Schema({
  collage_img: String,
  collage_name: String,
});

// Create model on the secondary connection
const College = secondaryConnection.model("College", collegeSchema);

export default College;
