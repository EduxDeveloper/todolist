import express from "express";
import todoController from "../controllers/todoController.js";

const router = express.Router();

//Obtener todos los todos del usuario
router.route("/").get(todoController.getAll);

//Filtrar todos
router.route("/filter").get(todoController.filter);

//Crear un nuevo todo
router.route("/").post(todoController.create);

//Obtener un todo por ID
router.route("/:id").get(todoController.getById);

//Actualizar un todo
router.route("/:id").put(todoController.update);

//Eliminar un todo
router.route("/:id").delete(todoController.delete);

//Toggle completado de un todo
router.route("/:id/toggle").patch(todoController.toggleCompleted);

export default router;
