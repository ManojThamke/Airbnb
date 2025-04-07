const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(
            "mongodb+srv://fusionfervor:Thamke%40Manoj@airbnb.zd5m3.mongodb.net/?retryWrites=true&w=majority&appName=Airbnb"
        );
        console.log('Database Conncted Successfully!');
    } catch (error) {
        console.error('Database Connection Failed: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;