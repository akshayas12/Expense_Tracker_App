const express=require('express')
const router=express.Router();
const{registerUser,loginUser,emailVerification}=require('../controllers/authController')


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/verify-email',emailVerification);
module.exports = router;
