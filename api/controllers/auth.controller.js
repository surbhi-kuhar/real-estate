import User from "../models/user.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      user: User,
      message: "user created",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
