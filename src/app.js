import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.listen(5000, console.log(chalk.bold.yellow("Servidor rodando na porta 5000")));
