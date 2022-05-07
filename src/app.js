import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import cadastroRouter from "./routes/cadastroRouter.js"
import authRouter from "./routes/authRouter.js"
import registroRouter from "./routes/registroRouter.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(cadastroRouter);
app.use(authRouter);
app.use(registroRouter);

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));
