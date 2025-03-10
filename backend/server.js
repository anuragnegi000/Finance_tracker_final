import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; // Import dotenv to load environment variables
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env, fallback to 5000
const MONGO_URI = process.env.MONGO_URI; // Use MONGO_URI from .env

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes);

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
