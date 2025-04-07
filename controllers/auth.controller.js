const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { validationResult } = require('express-validator');
const User = require('../models/user.model');

require('dotenv').config();

let refreshTokens = [];

// Helper function to generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// Register User
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'user', 
            status: 'active' 
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account not activated. Contact admin.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        refreshTokens.push(refreshToken);

        // ✅ Set both tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: false,
            sameSite: "lax"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        // ✅ Store user session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        if (req.headers["accept"] === "application/json") {
            return res.json({ message: "Login successful", accessToken, role: user.role });
        }

        if (user.role === "admin")  {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect("/")
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Refresh Token
const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token || !refreshTokens.includes(token)) {
        return res.status(403).json({ message: 'Access Denied! No valid refresh token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

// Logout User
const logoutUser = (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        refreshTokens = refreshTokens.filter(t => t !== token);
    }

    // ✅ Clear cookies
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // ✅ Destroy session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clears session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
};


module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser
};
