import express from "express";
import verifyTokenController from "../controllers/verifyTokenController.js";

const router = express.Router();

router.route("/").get(verifyTokenController.verify);

export default router;
