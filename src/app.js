import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from 'bcrypt';
import { stripHtml } from "string-strip-html";
import { v4 as uuid } from 'uuid';
import db from "./db.js";
import { postCadastro } from "./controllers/cadastroController.js";
import { postLogin } from "./controllers/loginController.js"
import { postRegistro, getRegistro } from "./controllers/registroController.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.post("/cadastro", postCadastro);
app.post("/login", postLogin);
app.post('/registro', postRegistro);
app.get('/registro', getRegistro)

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));
