const Category = require("../models/Category");

// Add Category
exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "❌ Category name is required." });

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({ message: "❌ Category already exists." });

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: "✅ Category added successfully!", category });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error." });
    }
};

// Get All Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error." });
    }
};

