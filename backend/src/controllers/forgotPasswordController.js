import userModel from "../models/userSchema.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { config } from "../config.js";

const forgotPasswordController = {};

// Almacén temporal para códigos de recuperación (en memoria)
// En producción, esto debería ir a la base de datos en el userSchema o una colección separada
const resetCodes = new Map();

forgotPasswordController.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const userFound = await userModel.findOne({ email });
        
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const randomCode = crypto.randomBytes(3).toString("hex");
        
        // Guardar el código con una expiración de 15 minutos
        resetCodes.set(email, {
            code: randomCode,
            expiresAt: Date.now() + 15 * 60 * 1000
        });
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });
        
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Recuperación de contraseña - ToDo App",
            text: `Para recuperar tu contraseña, utiliza este código: ${randomCode}. Expira en 15 minutos.`,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error " + error);
                return res.status(500).json({ message: "Error sending email" });
            }
            return res.status(200).json({ message: "Recovery email sent" });
        });
        
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

forgotPasswordController.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "Email, code and new password are required" });
        }
        
        const resetData = resetCodes.get(email);
        
        if (!resetData) {
            return res.status(400).json({ message: "No reset request found for this email" });
        }
        
        if (resetData.expiresAt < Date.now()) {
            resetCodes.delete(email);
            return res.status(400).json({ message: "Code has expired" });
        }
        
        if (resetData.code !== code) {
            return res.status(400).json({ message: "Invalid code" });
        }
        
        const userFound = await userModel.findOne({ email });
        
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const passwordHashed = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHashed;
        await userFound.save();
        
        // Limpiar el código usado
        resetCodes.delete(email);
        
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default forgotPasswordController;
