import express from "express";
import { login, register } from "../contollers/authControllers.js";
import { validateLogin, validateRegister } from "../middlewear/validator.js";
import User from "../models/User.js";
import { userAuth } from "../middlewear/auth.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/profile", userAuth, async (req, res) => {
  try {
    // 'protect' middleware ne req.user mein ID daal di hai
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user }); // Frontend ko user ka data bhej do
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
