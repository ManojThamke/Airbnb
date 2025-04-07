const express = require('express');
const cookieParser = require('cookie-parser');
const { body } = require('express-validator');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/auth.controller');

const router = express.Router();
router.use(cookieParser());

// Render Login Page (GET Request)
router.get('/login', (req, res) => {
    res.render('login'); // Ensure views/login.ejs exists
});

// Render Signup Page (GET Request)
router.get('/signup', (req, res) => {
    res.render('signup'); // Ensure views/signup.ejs exists
});
router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('profile', { 
        user: { 
            name: req.session.user.name || "Guest User", 
            email: req.session.user.email || "No email provided",
            avatar: req.session.user.avatar || 'https://i.pravatar.cc/150' 
        } 
    });
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.redirect('/'); // Redirect to home after logout
    });
});

// Register Route (POST Request)
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    registerUser
);

// Login Route (POST Request)
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    loginUser
);

// Refresh Token Route (POST Request)
router.post('/refresh-token', refreshToken);

// Logout Route (POST Request)
router.post('/logout', logoutUser);

module.exports = router;
