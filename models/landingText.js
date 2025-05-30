import mongoose from "mongoose";

// Secondary MongoDB URI
const secondaryMongoURI = "mongodb+srv://vextech2025:vextech2025@vextech.pdqvgoh.mongodb.net/?retryWrites=true&w=majority&appName=vextech";

// Create secondary connection if you haven't already
const secondaryConnection = mongoose.createConnection(secondaryMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const landingTextSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  }
});

// Bind model to secondary connection
const LandingText = secondaryConnection.model("LandingText", landingTextSchema);

export default LandingText;
