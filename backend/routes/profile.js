const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/getProfile", authMiddleware, profileController.getProfile);
router.put("/updateProfile", authMiddleware, profileController.updateProfile);
router.post("/uploadProfileImage", authMiddleware, upload.single("profileImage"), profileController.uploadProfileImage);

module.exports = router;
