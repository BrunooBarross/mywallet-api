import { Router } from "express";
import { postRegistro, getRegistro } from ".././controllers/registroController.js"

const registroRouter = Router();

registroRouter.post('/registro', postRegistro);
registroRouter.get('/registro', getRegistro);

export default registroRouter;