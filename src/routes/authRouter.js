import { Router } from "express";
import { postLogin } from ".././controllers/authController.js"

const authRouter = Router();

authRouter.post('/sign-in', postLogin);

export default authRouter;