import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";
import bcrypt from 'bcrypt';
import { stripHtml } from "string-strip-html";
import { v4 as uuid } from 'uuid';


dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
const dbCarteira = mongoClient.db("carteira");

const app = express();
app.use(cors());
app.use(json());

app.post("/cadastro", async (req, res) => {
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
        await mongoClient.connect();
        const usuariosCollection = dbCarteira.collection('usuarios');
        const temEmail = await usuariosCollection.findOne({ email: email });
        if (temEmail) {
            console.log(chalk.bold.red("O email já existe"));
            res.status(409).send("Email já cadastrado");
            return;
        }
        await usuariosCollection.insertOne({ nome, email, senha: senhaCriptografada});
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
        email: joi.string().email().required()
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
        if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
            const token = uuid();
            await dbCarteira.collection('sessoes').insertOne({ usuarioId: usuario._id, token });
            res.status(200).send({token:token, nome: usuario.nome});
        } else {
            // usuário não encontrado (email ou senha incorretos)
            res.sendStatus(409);
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

})

app.post('/registro', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token){return res.sendStatus(401)};
 
   try {
        await mongoClient.connect();
        const sessoesCollection = dbCarteira.collection("sessoes");
        const temUsuario = await sessoesCollection.findOne({ token: token });
       
        if(!temUsuario){
            res.sendStatus(406);
            return;
        }

        const usuarioId = temUsuario.usuarioId;
        const carteiraCollection = dbCarteira.collection("registros");
        await carteiraCollection.insertOne({...req.body, usuarioId});
        res.sendStatus(201);
   } catch (error) {
        console.log(error);
        res.sendStatus(500);
   }
})

app.get('/registro', async (req, res) =>{
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token){return res.sendStatus(401)};
    
    try {
        await mongoClient.connect();
        const sessoesCollection = dbCarteira.collection("sessoes");
        const temUsuario = await sessoesCollection.findOne({ token: token });
       
        if(!temUsuario){
            res.sendStatus(406);
            return;
        }

        const usuarioId = temUsuario.usuarioId;
        const carteiraCollection = dbCarteira.collection("registros");
        const registros = await carteiraCollection.find({ usuarioId }).toArray();
        registros.forEach(registro => {delete registro.usuarioId});
        if(registros) {
            console.log(registros);
            res.status(200).send([...registros]);
            return;
      } else {
            res.sendStatus(401);
      }
   } catch (error) {
        console.log(error);
        res.sendStatus(500);
   }
})

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));
