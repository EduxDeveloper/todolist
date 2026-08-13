import express from "express";
import forgotPasswordController from "../controllers/forgotPasswordController.js";

const router = express.Router();

router.route("/forgot").post(forgotPasswordController.forgotPassword);
router.route("/reset").post(forgotPasswordController.resetPassword);

export default router;
