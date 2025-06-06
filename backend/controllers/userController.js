import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";

dotenv.config();

//@description Auth user & get token
//@route       POST/api/users/login
//@access      Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@description Register user
//@route       POST/api/users/
//@access      Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: false,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@description Logout the user & clear the cookie
//@route       POST/api/users/logout
//@access      Private
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt").status(200).json({
    msg: "Logged out successfully",
  });
});

//@description Get user profile
//@route       GET/api/users/profile
//@access      Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@description  Update user profile
//@route       PUT/api/users/profile
//@access      Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    (user.name = req.body.name || user.name),
      (user.email = req.body.email || user.email);

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  }
});

//No need for ID in user Routes since we will be using cookies to get ID

//@description Get users
//@route       GET/api/users/:id
//@access      Private/Admin
const getUserbyId = asyncHandler(async (req, res) => {
  //Admin route to get a user by ID
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
//@description Get users
//@route       GET/api/users/
//@access      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users); //Admin route to get all the users
});

//@description Delete users
//@route       DELETE/api/users/:id
//@access      Private/Admin
const deleteUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@description Update user
//@route       UPDATE/api/users/:id
//@access      Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById({ _id: req.params.id });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserbyId,
  getUsers,
  deleteUsers,
  updateUser,
};
