import joi from "joi";

export async function validarTransacao(req, res, next) {
    const schema = joi.object({
        tipo: joi.string().valid('entrada','saida').required(),
        data: joi.string().pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/).required(),
        valor: joi.string().required(),
        descricao: joi.string().required()
    })
    const validacao = schema.validate(req.body, { abortEarly: false })

    if (validacao.error) {
        console.log(chalk.bold.red("Erro joi cadastro"), validacao.error.details)
        res.sendStatus(422);
        return;
    }
    next();
}