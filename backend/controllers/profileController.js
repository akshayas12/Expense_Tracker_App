const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, phone, place } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.place = place || user.place;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Image uploaded", profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
