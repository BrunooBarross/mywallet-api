import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from 'bcrypt';
import { stripHtml } from "string-strip-html";

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
const dbCarteira = mongoClient.db("carteira");

const app = express();
app.use(cors());
app.use(json());

app.post("/cadastrar", async (req, res) => {
    const { senha, verificarSenha } = req.body;
    const nome = stripHtml(req.body.email).result.trim();
    const email = stripHtml(req.body.email).result.trim();

    if (senha !== verificarSenha) {
        console.log('senhas diferentes')
        res.sendStatus(406);
        return;
    }

    const schema = joi.object({
        nome: joi.string().required(),
        email: joi.string().required(),
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
        await mongoClient.connect();
        const usuariosCollection = dbCarteira.collection('usuarios');
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
})

app.post("/login", async (req, res) => {
    const { senha } = req.body;
    let email = stripHtml(req.body.email).result.trim();

    const schema = joi.object({
        email: joi.string().pattern(/[a-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).required()
    })
    const validacao = schema.validate({ email }, { abortEarly: false });
    if (validacao.error) {
        console.log(chalk.bold.red("Erro login/joi"), validacao.error.details)
        res.sendStatus(422);
        return;
    }

    try {
        await mongoClient.connect();
        const usuario = await dbCarteira.collection('usuarios').findOne({ email });
        if(usuario && bcrypt.compareSync(senha, usuario.senha)) {
            res.sendStatus(200);
        } else {
            // usuário não encontrado (email ou senha incorretos)
            res.sendStatus(409);
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

})

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));
