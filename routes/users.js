const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//shows the register page
router.get('/register', users.showRegister);

//registers a new user
router.post('/register', upload.array('avi'), wrapAsync(users.registerUser));

//logs a user in
router.get('/login', users.loginPage);

router.post('/login', passport.authenticate('local', {failureFlash: true,
     failureRedirect:'/login'}), users.loginUser);

//logs a user out

router.get('/logout', users.logout);

module.exports = router;
