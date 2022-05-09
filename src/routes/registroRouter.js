import { Router } from "express";
import { postRegistro, getRegistro, deleteRegistro } from ".././controllers/registroController.js"
import { validarToken } from "./../middlewares/tokenMiddleware.js"
import { validarTransacao } from "./../middlewares/transacoesmiddlewares.js"

const registroRouter = Router();

registroRouter.post('/registro', validarToken, validarTransacao, postRegistro);
registroRouter.get('/registro', validarToken, getRegistro);
registroRouter.delete('/registro/:id', validarToken, deleteRegistro);

export default registroRouter;