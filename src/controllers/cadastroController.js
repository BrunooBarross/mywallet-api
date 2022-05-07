import chalk from "chalk";
import joi from "joi";
import bcrypt from 'bcrypt';
import { stripHtml } from "string-strip-html";
import db from ".././db.js";

export async function postCadastro(req, res) {
    const { senha, verificarSenha } = req.body;
    const nome = stripHtml(req.body.nome).result.trim();
    const email = stripHtml(req.body.email).result.trim();

    if (senha !== verificarSenha) {
        console.log('senhas diferentes')
        res.sendStatus(406);
        return;
    }

    const schema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required(),
        verificarSenha: joi.string().required()
    })
    const validacao = schema.validate(req.body, { abortEarly: false })

    if (validacao.error) {
        console.log(chalk.bold.red("Erro joi cadastro"), validacao.error.details)
        res.sendStatus(422);
        return;
    }

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