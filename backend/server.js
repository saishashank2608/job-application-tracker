const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
require('dotenv').config();
const jobRoutes = require("./routes/jobRoutes");

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", jobRoutes);


connectDB(); // Call the connectDB function to establish MongoDB connection


app.get('/', (req, res) => {
    res.send('Hello world!');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
