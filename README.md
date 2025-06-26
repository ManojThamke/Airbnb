# 🏡 Airbnb Clone – Full-Stack Booking Platform

A full-stack Airbnb clone built using **Node.js**, **Express**, **EJS**, **MongoDB**, and basic **frontend styling (CSS & JavaScript)**. This project mimics core Airbnb functionality such as user authentication, hotel listing, booking, and search with filters.

---

## 📌 Features

* 🧭 Clean, responsive layout with header, search bar, and footer
* 🏨 Hotel/property listing and browsing functionality
* 🔍 Search hotels with filters like location, price, and rating
* 📑 Pagination support for long hotel lists
* 👤 User Signup and Login with authentication (using sessions/cookies)
* 🛏️ Hotel Booking functionality for logged-in users
* 🔐 Role-based access for admin and normal users
* 📝 Admins can create, edit, and delete listings
* 🧱 Clean MVC architecture (Models, Views, Controllers)

---

## 🧱 Folder Structure

Airbnb/
├── config/             → Database and session configuration
├── controllers/        → Route logic for hotels, users, auth
├── middleware/         → Authentication middleware
├── models/             → Mongoose schemas
├── public/             → Static assets (CSS, JS)
│   ├── css/
│   └── js/
├── routes/             → Route files (auth, users, bookings, etc.)
├── views/              → EJS templates
│   ├── partials/       → Reusable components like header/footer
│   └── pages/          → Individual views
├── .env                → Environment variables
├── app.js              → App entry point
├── package.json        → Project dependencies

---

## ⚙️ Tech Stack

### 🔧 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* express-session & cookie-parser
* dotenv

### 🎨 Frontend

* EJS Templating Engine
* HTML5, CSS3, JavaScript
* Font Awesome (icons)

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone [https://github.com/ManojThamke/Airbnb.git](https://github.com/ManojThamke/Airbnb.git)
cd Airbnb

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following:

PORT=5000
MONGO\_URL=mongodb://localhost:27017/airbnb
SESSION\_SECRET=yourSecretKey

### 4. Start the Development Server

npm start

Now visit: `http://localhost:5000` in your browser


## 🗂️ Future Enhancements

* 📅 Add calendar date picker for bookings
* 🖼️ Support image uploads for listings
* 💳 Payment gateway integration (Stripe, Razorpay)
* 🔐 OAuth via Google/Facebook login
* 📱 Improve mobile responsiveness
* 📤 Upload hotel data via admin panel

---

## 🙋‍♂️ Author

**Manoj Thamke**
[GitHub](https://github.com/ManojThamke) | [LinkedIn](https://www.linkedin.com/in/manojthamke)

Live Demo: https://airbnb-clone-qmdz.onrender.com/
