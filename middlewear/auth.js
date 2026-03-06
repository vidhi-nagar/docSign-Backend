import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  // const { token } = req.cookies;
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);
  if (!token) {
    return res.status(400).json({ message: "No token,authorization denied" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("user ki details auth me", decodedToken);
    if (decodedToken.id) {
      req.user = decodedToken;
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
