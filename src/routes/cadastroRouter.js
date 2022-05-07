import { Router } from "express";
import { postCadastro } from ".././controllers/cadastroController.js"

const cadastroRouter = Router();

cadastroRouter.post('/sign-up', postCadastro);

export default cadastroRouter;