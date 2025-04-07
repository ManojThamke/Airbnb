const Booking = require("../models/booking.model"); // Ensure correct path
const User = require("../models/user.model"); // Ensure correct path
const Hotel = require("../models/hotel.model"); // Ensure correct path

// Admin Dashboard - View All Bookings with Pagination
const getAdminDashboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get current page, default to 1
        const limit = 10; // Number of bookings per page
        const skip = (page - 1) * limit;

        // Fetch total bookings count for pagination
        const totalBookings = await Booking.countDocuments();
        const totalPages = Math.ceil(totalBookings / limit);

        // Fetch paginated bookings with user and hotel details
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('hotel', 'name location')
            .skip(skip)
            .limit(limit);

        // Fetch all hotels for the admin dashboard (optional)
        const hotels = await Hotel.find();

        // Render admin-dashboard.ejs with data
        res.render('admin-dashboard', {
            bookings,
            hotels,       // Ensure hotels data is passed
            totalPages,   // Ensure totalPages is passed
            currentPage: page // Ensure currentPage is passed
        });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Export the controller functions
module.exports = {
    getAdminDashboard
};
