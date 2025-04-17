const Expense = require("../models/expense");
const Category=require('../models/Category')
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

exports.downloadExcel = async (req, res) => {
    try {
        // ✅ Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ✅ Fetch only this user's expenses and populate category name
        const expenses = await Expense.find({ userId: req.user.userId })
            .populate('category', 'name')
            .lean();

        // ✅ Format data for Excel
        const formattedExpenses = expenses.map(exp => ({
            Date: exp.date.toISOString().split('T')[0],
            Category: exp.category?.name || 'Unknown',
            Amount: exp.amount
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedExpenses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

        const dirPath = path.join(__dirname, '../data');
        const filePath = path.join(dirPath, 'Expense_Report.xlsx');

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        XLSX.writeFile(workbook, filePath);

        res.download(filePath, 'Expense_Report.xlsx', (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Download failed' });
            } else {
                fs.unlinkSync(filePath); // Delete file after download
            }
        });
    } catch (error) {
        console.error('Excel generation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//  Add Expense
exports.addExpense = async (req, res) => {
    try {
        const { category, amount } = req.body;
        if (!category || !amount) return res.status(400).json({ message: "Missing required fields." });

        const validCategory = await Category.findById(category);
if (!validCategory) return res.status(400).json({ message: "Invalid category ID." });

        if (!req.user || !req.user.userId) return res.status(401).json({ message: "Unauthorized" });

        const expense = new Expense({
            userId: req.user.userId,
            category: validCategory._id,  // Store category ID
            amount,
            date: new Date()
        });

        await expense.save();
        res.status(201).json({ message: "Expense added successfully!", expense });
    } catch (error) {
        console.error("Expense Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//  Get All Expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId }).populate("category", "name");
        res.json({ expenses });  // Wrap expenses in an object
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};


// Get Expense Summary for Charts
exports.getExpenseSummary = async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            { $match: { userId: req.user.userId } }, // Fix userId reference
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }
        ]);
        
        
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: " Server error." });
    }
};
