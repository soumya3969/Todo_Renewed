import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided."
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token."
      });
    }
    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log("error in verifyToken", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
