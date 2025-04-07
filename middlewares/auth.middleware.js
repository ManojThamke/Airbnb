const jwt = require('jsonwebtoken');

// Authentication Middleware with Debugging
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;

    console.log("Received Token from Client:", token); // Debugging log

    if (!token) {
        return res.status(401).json({ message: "Unauthorized! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request

        console.log("Decoded Token:", decoded); // Debugging log

        next();
    } catch (error) {
        console.error("Token Verification Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        res.status(403).json({ message: "Invalid token." });
    }
};

// Role-Based Access Control (RBAC) Middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized! Login required." });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden! Insufficient permissions." });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };
