import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST a new transaction
router.post("/", async (req, res) => {
  try {
    const { amount, date, category, description } = req.body;
    const transaction = new Transaction({ amount, date, category, description });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// DELETE a transaction
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting transaction" });
  }
});

export default router;
