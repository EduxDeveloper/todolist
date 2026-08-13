import { config } from "./config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
//User
import registerUserRouter from "./routes/registerUserRoute.js";
import loginUserRouter from "./routes/loginUserRoute.js";
import logoutRouter from "./routes/logoutRoute.js";
import verifyTokenRouter from "./routes/verifyTokenRoute.js";
import profileRouter from "./routes/profileRoute.js";
import forgotPasswordRouter from "./routes/forgotPasswordRoute.js";
//Todo
import todoRouter from "./routes/todoRoute.js";
//Middleware
import { validateAuthCookie } from "./middlewares/authMiddleware.js";

//Creo una constante que es igual a la libreria Express
const app = express();

const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        //permitir el envío de cookies y credenciales
        credentials: true,
    }),
);
app.use(cookieParser());

app.use(express.json());

//User - Rutas públicas (no requieren autenticación)
app.use("/api/register", registerUserRouter);
app.use("/api/login", loginUserRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/password", forgotPasswordRouter);

//User - Rutas protegidas
app.use("/api/verify", validateAuthCookie(["user"]), verifyTokenRouter);
app.use("/api/profile", validateAuthCookie(["user"]), profileRouter);

//Todo - Rutas protegidas (requieren autenticación)
app.use("/api/todos", validateAuthCookie(["user"]), todoRouter);

export default app;
