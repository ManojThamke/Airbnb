const express = require("express");
const router = express.Router();
const { getAdminDashboard } = require("../controllers/admin.controller");
const { authenticateUser, authorizeRole } = require("../middlewares/auth.middleware");

// Protect the admin dashboard route (Only accessible by Admins)
router.get("/dashboard", authenticateUser, authorizeRole("admin"), getAdminDashboard);

module.exports = router;