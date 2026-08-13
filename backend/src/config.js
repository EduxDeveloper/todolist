import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//ejecutamos la libreria dotenv - cargamos el .env desde src/
dotenv.config({ path: join(__dirname, ".env") });

export const config = {
    JWT: {
        secret: process.env.JWT_Secret_key,
    },
    email: {
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    },
    db: {
        uri: process.env.DB_URI
    }
}