import db from "./../db.js";
export async function validarToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) { return res.sendStatus(401) };

    try {
        const sessoesCollection = db.collection("sessoes");
        const temTokenUsuario = await sessoesCollection.findOne({ token: token });

        if (!temTokenUsuario) {
            res.sendStatus(401);
            return;
        }
        const usuarioId = temTokenUsuario.usuarioId;
        res.locals.usuarioId = usuarioId;
        res.locals.token = token;
        next();
    } catch (error) {
        console.log("token",error);
        res.sendStatus(500);
    }
}
