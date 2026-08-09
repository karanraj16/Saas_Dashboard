const express = require("express");
const cors = require('cors');
const dotenv =  require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors())
app.use(express.json())

app.post('/test', (req, res) => {
    res.send("Server is perfectly working! DB connection thaan problem.");
});

app.use('/api/users',require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.use(notFound);
app.use(errorHandler);

app.get('/',(req,res) => {
    res.send('SaaS Dashboard API is running perfectly!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server is running beautifully on port ${PORT}`);
});
    