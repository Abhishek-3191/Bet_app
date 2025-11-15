require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../../models/Users');

// REGISTER
const registerUser = async (req, res) => {
    const { userName, password, email } = req.body;

    try {
        const existed = await User.findOne({ email });
        if (existed) {
            return res.json({
                success: false,
                message: "Email already registered",
            });
        }

        const hash = await bcrypt.hash(password, 12);

        const newUser = new User({
            userName,
            email,
            password: hash,
            points: 1000,        // give starting points for betting app
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                points: newUser.points
            },
        });
    } catch (error) {
        console.log("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while registering",
        });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    const { password, email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({
                success: false,
                message: "Incorrect password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                points: user.points
            }
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while logging in",
        });
    }
};

// LOGOUT
const logoutUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// MIDDLEWARE
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({
            success: false,
            message: "No token, unauthenticated",
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware,
};
