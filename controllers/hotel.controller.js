const Hotel = require('../models/hotel.model');

// Create a new hotel (Admin only)
exports.createHotel = async (req, res) => {
    try {
        const { name, location, pricePerNight, rating, availableRooms } = req.body;
        if (!name || !location || !pricePerNight || !availableRooms) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const hotel = new Hotel({ name, location, pricePerNight, rating, availableRooms, imageUrls });
        await hotel.save();

        res.status(201).json({ message: "Hotel added successfully", hotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all hotels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ hotels });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single hotel by ID
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        res.render('hotelDetails', { hotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update hotel details
exports.updateHotel = async (req, res) => {
    try {
        const updatedData = { ...req.body };

        if (req.files && req.files.length > 0) {
            updatedData.imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        const hotel = await Hotel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!hotel) {
            console.log("Hotel not found");
            return res.status(404).json({ error: "Hotel not found" });
        }

        console.log("Hotel updated successfully:", hotel);
        res.redirect('/admin/dashboard'); // Redirect after successful update
    } catch (error) {
        console.error("Error updating hotel:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete a hotel (Admin only)
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!hotel) {
            console.log("Hotel not found");
            return res.status(404).json({ error: "Hotel not found" });
        }

        console.log("Hotel deleted successfully");
        res.redirect('/admin/dashboard'); // Redirect after successful deletion
    } catch (error) {
        console.error("Error deleting hotel:", error.message);
        res.status(500).json({ error: error.message });
    }
};

