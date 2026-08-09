const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected successfully: ${conn.Connection.host}`);
    }catch(e){
        console.error(`MongoDB Connection error: ${e.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;