import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes);

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/financeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
