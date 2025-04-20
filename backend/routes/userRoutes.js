import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserbyId,
  getUsers,
  deleteUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/auth", authUser); // We can directly use Router.method if there's only one method in a route
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUsers)
  .get(protect, admin, getUserbyId)
  .put(protect, admin, updateUser);

export default router;
