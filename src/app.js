import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { postCadastro, postLogin  } from "./controllers/authController.js";
import registroRouter from "./routes/registroRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", postCadastro);
app.post("/sign-in", postLogin);
app.use(registroRouter);

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));
