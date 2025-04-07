const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');
const mongoose = require("mongoose");

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut, guests, paymentMethod } = req.body;
        const userId = req.user?.id;

        console.log("[DEBUG] Booking Request Received", req.body);
        console.log("[DEBUG] Authenticated User:", req.user);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized! Please login first." });
        }

        if (!hotelId || !checkIn || !checkOut || !guests) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const totalDays = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
        if (totalDays < 1) return res.status(400).json({ message: "Invalid date range" });

        const totalPrice = hotel.pricePerNight * totalDays * guests;

        const booking = new Booking({
            user: userId,
            hotel: hotelId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            totalPrice,
            paymentMethod
        });

        await booking.save();
        res.status(201).json({ message: "Booking successful", booking });

    } catch (error) {
        console.error("[DEBUG] Server Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('hotel', 'name location')
            .skip(skip)
            .limit(limit)
            .exec();

        const totalBookings = await Booking.countDocuments();

        res.render("admin-dashboard", {
            bookings,
            totalPages: Math.ceil(totalBookings / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
};



// Get a user's own bookings
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ user: userId }).populate("hotel", "name location pricePerNight");

        res.render("my-bookings", { bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Cancel a booking (User can cancel only their booking, Admin can cancel any)
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to cancel this booking" });
        }

        await Booking.findByIdAndDelete(id);
        res.json({ message: "Booking canceled successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const renderBookingPage = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        if (!hotel) return res.status(404).send("Hotel not found");

        res.render("booking", { hotel });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

exports.bookHotel = async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut, guests, paymentMethod } = req.body;

        // Check if a booking already exists for the same user, hotel, and dates
        const existingBooking = await Booking.findOne({ hotelId, checkIn, checkOut });

        if (existingBooking) {
            return res.status(400).json({ message: "Booking already exists for these dates." });
        }

        const newBooking = new Booking({ hotelId, checkIn, checkOut, guests, paymentMethod });
        await newBooking.save();

        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

module.exports = { 
    createBooking, 
    getAllBookings, 
    getUserBookings, 
    cancelBooking,
    renderBookingPage 
};
 