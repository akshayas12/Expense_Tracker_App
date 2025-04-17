const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "❌ No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging

    if (!decoded.userId) return res.status(400).json({ message: "❌ User ID missing in token." });

    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "❌ Invalid or expired token." });
  }
};
