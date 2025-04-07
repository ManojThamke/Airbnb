const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel.model');
const Booking = require('../models/booking.model');
const { authenticateUser, authorizeRole } = require('../middlewares/auth.middleware');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const searchQuery = req.query || {}; // Capture search filters
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = 10; // Limit per page

        // Fetch hotels with pagination
        const hotels = await Hotel.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalHotels = await Hotel.countDocuments();
        const totalPages = Math.ceil(totalHotels / limit);

        res.render('index', {
            hotels,
            searchQuery,
            currentPage: page,
            totalPages,
            session: req.session 
        });

    } catch (err) {
        res.status(500).send('Error loading hotels');
    }
});


module.exports = router;
