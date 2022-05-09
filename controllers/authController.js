import bcrypt from 'bcrypt';
import { stripHtml } from "string-strip-html";
import { v4 as uuid } from 'uuid';
import db from "./../db.js";

export async function postLogin(req, res) {
    const { senha } = req.body;
    let email = stripHtml(req.body.email).result.trim();

    try {
        const usuario = await db.collection('usuarios').findOne({ email });
        if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
            const token = uuid();
            await db.collection('sessoes').insertOne({ usuarioId: usuario._id, token });
            res.status(200).send({ token: token, nome: usuario.nome });
        } else {
            // usuário não encontrado (email ou senha incorretos)
            res.sendStatus(409);
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}