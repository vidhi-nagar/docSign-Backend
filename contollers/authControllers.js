import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//register user
export const register = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //hashed password send to our user than save
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    //saving the user with hashed password

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .json({ message: "User registered!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

//login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ success: "false", message: "Email and Password requires!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ success: "false", message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ sucess: "false", message: "Invalid password " });
    }

    //Cookie check
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {});

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: "true",
      message: "login successfully",
      token: token, // <-- Ye check karo, kya ye likha hai?
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
