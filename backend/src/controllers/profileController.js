import userModel from "../models/userSchema.js";
import bcrypt from "bcryptjs";

const profileController = {};

profileController.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userFound = await userModel.findById(userId).select("-password");
        
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json(userFound);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

profileController.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }
        
        const userFound = await userModel.findById(userId);
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, userFound.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }
        
        const passwordHashed = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHashed;
        await userFound.save();
        
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default profileController;
