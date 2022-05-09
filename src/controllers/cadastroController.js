import chalk from "chalk";
import joi from "joi";
import bcrypt from 'bcrypt';
import { stripHtml } from "string-strip-html";
import db from ".././db.js";

export async function postCadastro(req, res) {
    const { senha } = req.body;
    const nome = stripHtml(req.body.nome).result.trim();
    const email = stripHtml(req.body.email).result.trim();

    const senhaCriptografada = bcrypt.hashSync(senha, 10);
    try {
        const usuariosCollection = db.collection('usuarios');
        const temEmail = await usuariosCollection.findOne({ email: email });
        if (temEmail) {
            console.log(chalk.bold.red("O email já existe"));
            res.status(409).send("Email já cadastrado");
            return;
        }
        await usuariosCollection.insertOne({ nome, email, senha: senhaCriptografada });
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}