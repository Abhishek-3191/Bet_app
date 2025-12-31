require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users")


// ================= REGISTER =================
const registerUser = async (req, res) => {
  const { userName, password, email } = req.body;

  try {
    const existed = await User.findOne({ email });
    if (existed) {
      return res.json({
        success: false,
        message: "User already exist with the same email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      points: 1000,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        points: newUser.points,
      },
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
};


// ================= LOGIN =================
const loginUser = async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Password doesn't match",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};


// ================= LOGOUT =================
const logoutUser = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
};


// ================= AUTH MIDDLEWARE =================
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};


// ================= CHECK AUTH =================
const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};


// ================= EXPORT =================
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  checkAuth,
};
