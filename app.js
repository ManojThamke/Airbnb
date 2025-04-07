require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const methodOverride = require('method-override');

const userRouter = require('./router/user.router');
const hotelRouter = require('./router/hotel.router');
const bookingRouter = require('./router/booking.router');
const authRoutes = require('./router/auth.router');
const indexRouter = require('./router/index.router');
const adminRouter = require('./router/admin.router');

const User = require('./models/user.model');
const Hotel = require('./models/hotel.model');
const Booking = require('./models/booking.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
connectDB().catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
});

// Set View Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Security Middleware
app.use(helmet()); // Adds security headers

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

// Session Middleware (Before Routes)
app.set('trust proxy', 1); // Needed if using secure cookies in production
app.use(session({
    secret: process.env.SECRET_KEY || 'fa18bd5cb98d597ddaff3d490ea9a8eec6ce9614acfd572f896b602766f3ee98',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to `true` in production (HTTPS required)
        httpOnly: true,
        sameSite: 'strict'
    }
}));

// Middleware to Make Session Available in Views
app.use((req, res, next) => {
    res.locals.session = req.session || null;
    next();
});

// Routes
app.use('/users', userRouter);
app.use('/hotels', hotelRouter);
app.use('/bookings', bookingRouter);
app.use('/auth', authRoutes);
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// Test Models Endpoint
app.get('/test-models', async (req, res) => {
    try {
        const [userCount, hotelCount, bookingCount] = await Promise.all([
            User.countDocuments(),
            Hotel.countDocuments(),
            Booking.countDocuments(),
        ]);

        res.json({
            message: 'Models are working!',
            users: userCount,
            hotels: hotelCount,
            bookings: bookingCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Default Route
app.get('/', (req, res) => {
    res.send('Server is running and Database is connected!');
});


// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// 500 Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
