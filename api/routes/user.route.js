import express from "express";
import { test, update, deleteUser, signout } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, update);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get('/signout',verifyToken,signout);

export default router;
