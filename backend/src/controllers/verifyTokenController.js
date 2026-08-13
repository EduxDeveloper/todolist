import userModel from "../models/userSchema.js";

const verifyTokenController = {};

verifyTokenController.verify = async (req, res) => {
    try {
        // El id del usuario ya viene en req.user gracias al authMiddleware
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

export default verifyTokenController;
