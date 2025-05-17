const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/sendEmail");
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 8800;

const registerUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging line

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists, use another email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        await newUser.save();
        console.log("New User Created:", newUser);

        // Generate verification token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send verification email
        await sendVerificationEmail(newUser.email, token);

        res.status(201).json({ message: "Signup successful! Check your email for verification." });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error during signup", error: error.message });
    }
};

const emailVerification = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ message: "Token is required." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) return res.status(400).json({ message: "Invalid token." });

        await User.findByIdAndUpdate(decoded.userId, { isVerified: true });

        res.redirect("https://expensetrackerbackend-7qyq.onrender.com//login"); // Redirect to frontend login page
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        if (!user.isVerified) return res.status(400).json({ message: "Email not verified. Check your inbox." });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = { registerUser, emailVerification, loginUser };
