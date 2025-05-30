import mongoose from 'mongoose';


const secondaryMongoURI = "mongodb+srv://vextech2025:vextech2025@vextech.pdqvgoh.mongodb.net/?retryWrites=true&w=majority&appName=vextech";

// Create a new connection instance for the secondary DB
const secondaryConnection = mongoose.createConnection(secondaryMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});





const projectSchema = new mongoose.Schema({
  card_img: { type: String, required: true },
  overlay_text: { type: String, required: true },
  project_title: { type: String, required: true },
  project_desc: { type: String, required: true },
  project_link: { type: String, required: true }
});



const Project = secondaryConnection.model("Project", projectSchema);

export default Project;
