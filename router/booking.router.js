const express = require('express');
const { authenticateUser, authorizeRole } = require('../middlewares/auth.middleware');
const {
    createBooking,
    getAllBookings,
    getUserBookings,
    cancelBooking,
    renderBookingPage
} = require('../controllers/booking.controller');

const router = express.Router();

//Logs the Decoded User Data
const debugUser = (req, res, next) => {
    console.log("Decoded User Data:", req.user);
    next();
};

// Create a new booking
router.post('/create', authenticateUser, authorizeRole('user'), createBooking);

// Get all bookings (Admin only)
router.get('/', authenticateUser, debugUser, authorizeRole('admin'), getAllBookings);

// Get a user's own bookings
router.get('/my-bookings', authenticateUser, debugUser, authorizeRole('user'), getUserBookings);

// Cancel a booking (User can cancel only their booking, Admin can cancel any)
router.delete('/:id', authenticateUser, debugUser, cancelBooking);

router.get("/:id", renderBookingPage);

module.exports = router;
