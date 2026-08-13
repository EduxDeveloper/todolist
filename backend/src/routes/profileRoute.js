import express from "express";
import profileController from "../controllers/profileController.js";

const router = express.Router();

router.route("/").get(profileController.getProfile);
router.route("/password").put(profileController.changePassword);

export default router;
