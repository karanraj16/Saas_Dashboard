const express = require("express");
const cors = require('cors');
const dotenv =  require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: ["https://saas-dashboard-green-xi.vercel.app", "http://localhost:5173"], 
    credentials: true
}));
app.use(express.json());

// 1. Basic Test Routes
app.get('/', (req, res) => {
    res.send('SaaS Dashboard API is running perfectly!');
});
app.post('/test', (req, res) => {
    res.send("Server is perfectly working!");
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.post('/api/payments/create-checkout-session', require('./controllers/paymentController').createCheckoutSession);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running beautifully on port ${PORT}`);
});