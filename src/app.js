import express, {json} from "express";
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
    const {senha, senhaverificar} = req.body;
    const nome = stripHtml(req.body.email).result.trim();
    const email = stripHtml(req.body.email).result.trim();

    if(senha !== senhaverificar){
        console.log('senhas diferentes')
        res.sendStatus(406);
        return;
    }

    const schema = joi.object({
        nome: joi.string().required(),
        email: joi.string().required(),
        senha: joi.string().required(),
        senhaverificar: joi.string().required()
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
        const temUsuario = await usuariosCollection.findOne({ email: email });
        if(temUsuario){
            console.log(chalk.bold.red("O email já existe"));
            res.status(409).send("Email já cadastrado");
            return;
        }
        await usuariosCollection.insertOne({nome, email, senha: senhaCriptografada});
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }
})

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));
