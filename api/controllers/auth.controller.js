import User from "../models/user.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
