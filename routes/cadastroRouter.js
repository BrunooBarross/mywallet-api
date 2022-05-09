import { Router } from "express";
import { postCadastro } from ".././controllers/cadastroController.js"
import { validarCadastro } from "./../middlewares/acessoUsuarioMiddleware.js"

const cadastroRouter = Router();

cadastroRouter.post('/sign-up', validarCadastro, postCadastro);

export default cadastroRouter;