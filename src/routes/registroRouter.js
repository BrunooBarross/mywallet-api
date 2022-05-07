import { Router } from "express";
import { postRegistro, getRegistro, deleteRegistro } from ".././controllers/registroController.js"

const registroRouter = Router();

registroRouter.post('/registro', postRegistro);
registroRouter.get('/registro', getRegistro);
registroRouter.delete('/registro/:id', deleteRegistro);

export default registroRouter;