import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({ message: "No token,authorization denied" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("user ki details auth me", decodedToken);
    if (decodedToken.id) {
      req.user = { id: decodedToken.id };
      console.log("user ki details auth me", req.user);
      next();
    } else {
      return res.json({
        success: false,
        message: "not authorizes. Login Again",
      });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
