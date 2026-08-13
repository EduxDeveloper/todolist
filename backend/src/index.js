import app from "./app.js";
import "./database.js"

const PORT = process.env.PORT || 4000;

//Creo una función para ejecutar
//el servidor
async function main() {
    app.listen(PORT)
    console.log(`Server on port ${PORT}`)
}

main()