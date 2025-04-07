const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const { getAdminDashboard } = require("../controllers/admin.controller");
const { authenticateUser, authorizeRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


// Create a new hotel (Admin only) with multiple images
router.post('/', authenticateUser, authorizeRole('admin'), upload.array('imageUrls', 5), hotelController.createHotel);

// Get a single hotel by ID
router.get('/:id', hotelController.getHotelById);

// Update hotel details with new images (Admin only)
router.put('/:id', authenticateUser, authorizeRole('admin'), upload.array('imageUrls', 5), hotelController.updateHotel);

// Delete a hotel (Admin only)
router.delete('/:id', authenticateUser, authorizeRole('admin'), hotelController.deleteHotel);
// Admin dashboard
router.get('/admin/dashboard', authenticateUser, authorizeRole('admin'), getAdminDashboard);



module.exports = router;
