const express = require("express");
const router = express.Router();
const { addExpense, getExpenses, getExpenseSummary, downloadExcel } = require("../controllers/expenseController");
const { addCategory, getCategories } = require("../controllers/categoryController");
const { getProfile, updateProfile } = require("../controllers/profileController"); // Import profile functions
const authMiddleware = require("../middleware/authMiddleware");

// **Expense Routes**
router.post("/add-expense", authMiddleware, addExpense);  
router.get("/getExpense", authMiddleware, getExpenses);
router.get("/summary", authMiddleware, getExpenseSummary);
router.get("/download-excel",authMiddleware, downloadExcel);

// **Category Routes**
router.post("/addCategory", addCategory);
router.get("/getCategories", getCategories);


module.exports = router;
