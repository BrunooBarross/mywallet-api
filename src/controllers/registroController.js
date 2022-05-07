import db from ".././db.js";
import { ObjectId } from "mongodb";

export async function postRegistro(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token){return res.sendStatus(401)};
 
    try {
            const sessoesCollection = db.collection("sessoes");
            const temUsuario = await sessoesCollection.findOne({ token: token });
        
            if(!temUsuario){
                res.sendStatus(406);
                return;
            }

            const usuarioId = temUsuario.usuarioId;
            const carteiraCollection = db.collection("registros");
            await carteiraCollection.insertOne({...req.body, usuarioId});
            res.sendStatus(201);
    } catch (error) {
            console.log(error);
            res.sendStatus(500);
    }
}

export async function getRegistro(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token){return res.sendStatus(401)};
    
    try {
        const sessoesCollection = db.collection("sessoes");
        const temUsuario = await sessoesCollection.findOne({ token: token });
       
        if(!temUsuario){
            res.sendStatus(406);
            return;
        }

        const usuarioId = temUsuario.usuarioId;
        const carteiraCollection = db.collection("registros");
        const registros = await carteiraCollection.find({ usuarioId }).toArray();
        registros.forEach(registro => {delete registro.usuarioId});
        if(registros) {
            res.status(200).send([...registros]);
            return;
      } 
        return res.sendStatus(401);
      
   } catch (error) {
        console.log(error);
        res.sendStatus(500);
   }
}
export async function deleteRegistro(req, res){
    const { authorization } = req.headers;
    const id = req.params.id;
    const token = authorization?.replace('Bearer ', '');
    if(!token){return res.sendStatus(401)};
    try {
        const registrosCollection = db.collection("registros");
        const temRegistro = await registrosCollection.findOne({ _id: ObjectId(id) });
        if(!temRegistro){
            console.log("não tem registro");
            res.sendStatus(404);
            return;
        }
        await registrosCollection.deleteOne({ _id: ObjectId(id) });
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}