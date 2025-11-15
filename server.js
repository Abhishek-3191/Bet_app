require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth/authroutes");

const app = express();

const PORT = process.env.PORT || 5000;
const dburl = process.env.MONGODB_URL;

// connect DB
mongoose.connect(dburl)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("Mongodb doesnt connected", err));

// middlewares
app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma',
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);

// start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
