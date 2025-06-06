import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//Protesct routes

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //Read the jwt from the cookie

  token = req.cookies.jwt; //refer user controller for variable names

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //object with userID field
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed ");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

//Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};

export { protect, admin };
