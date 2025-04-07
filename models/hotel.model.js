const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        pricePerNight: {
            type: Number,  // Changed from String to Number
            required: true,
            min: 0
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 5  // Assuming a 5-star rating system
        },
        availableRooms: {
            type: Number,
            required: true,
            min: 0
        },
        imageUrls: [
            {
                type: String,
                required: true
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hotel', HotelSchema);
