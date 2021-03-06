import db from "./../db.js";
import { ObjectId } from "mongodb";

export async function postRegistro(req, res){
    const { usuarioId } = res.locals;
    try {
            const carteiraCollection = db.collection("registros");
            await carteiraCollection.insertOne({...req.body, usuarioId});
            res.sendStatus(201);
    } catch (error) {
            console.log(error);
            res.sendStatus(500);
    }
}
export async function getRegistro(req, res){
    const { usuarioId } = res.locals;
    try {
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
    const id = req.params.id;
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