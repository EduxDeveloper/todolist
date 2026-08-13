import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../config.js";

import userModel from "../models/userSchema.js";

//Array de funciones
const loginUserController = {};

loginUserController.login = async (req, res) => {
    try {
        //#1- Solicitar los datos
        const { email, password } = req.body;

        //Verificar si el correo existe en la base de datos
        const userFound = await userModel.findOne({ email });

        //Si no existe el correo
        if (!userFound) {
            return res.status(400).json({ message: "User not found" });
        }

        //Verificamos que la cuenta no esté bloqueada
        if (userFound.timeOut && userFound.timeOut > Date.now()) {
            return res.status(403).json({ message: "Blocked account" });
        }

        //Validar la contraseña
        const isMatch = await bcrypt.compare(password, userFound.password);

        //Si la contraseña está incorrecta
        if (!isMatch) {
            //Sumar 1 a la cantidad de intentos fallidos
            userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;

            if (userFound.loginAttemps >= 5) {
                userFound.timeOut = Date.now() + 5 * 60 * 1000;
                userFound.loginAttemps = 0;

                await userFound.save();

                return res
                    .status(403)
                    .json({ message: "Blocked account for many attemps" });
            }

            await userFound.save();

            return res.status(401).json({ message: "Wrong password" });
        }

        //Reseteamos intentos si el login es correcto
        userFound.loginAttemps = 0;
        userFound.timeOut = null;
        await userFound.save();

        //Generar el token
        const token = jsonwebtoken.sign(
            //#1- ¿que vamos a guardar?
            { id: userFound._id, userType: "user" },
            //#2- secret key
            config.JWT.secret,
            //#3- Cuando expira
            { expiresIn: "30d" },
        );

        //El token lo guardamos en una cookie
        res.cookie("authCookie", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });

        return res.status(200).json({ message: "Login successfully" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default loginUserController;
