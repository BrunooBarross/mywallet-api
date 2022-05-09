import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.BANCO);
    console.log('Conexão com o banco de dados MongoDB estabelecida!');
} catch (error) {
    console.log('Erro ao se conectar ao banco de dados', error)
}

export default db;