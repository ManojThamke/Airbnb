const express = require('express');
const { authenticateUser, authorizeRole } = require('../middlewares/auth.middleware');
const { getAllUsers, getUserProfile, loginUser, signupUser } = require('../controllers/user.controller');

const router = express.Router();

// Get all users (Admin Only)
router.get('/', authenticateUser, authorizeRole(['admin']), getAllUsers);

// Get own profile (Authenticated Users)
router.get('/me', authenticateUser, getUserProfile);

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Render signup page
router.get('/signup', (req, res) => {
    res.render('signup');
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

// Handle login submission
router.post('/login', loginUser);

// Handle signup submission
router.post('/signup', signupUser);

module.exports = router;
