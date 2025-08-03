import { validationResult } from "express-validator";
import { User } from "../Models/User.mjs";

export const userProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(
      'userName profilePicture bio location institution problemsSolved totalSubmissions acceptedSubmissions'
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'userName email profilePicture bio location institution problemsSolved totalSubmissions acceptedSubmissions'
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getMyProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { profilePicture, bio, location, institution } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (institution !== undefined) user.institution = institution;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Edit Profile Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
