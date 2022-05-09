import joi from "joi";

export async function validarCadastro(req, res, next) {
    const { senha, verificarSenha } = req.body;

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
    next();
}

export async function validarLogin(req, res, next) {
    const schema = joi.object({
        email: joi.string().email().required(),
        senha: joi.string().required()
    })
    const validacao = schema.validate((req.body), { abortEarly: false });
    if (validacao.error) {
        console.log(chalk.bold.red("Erro login/joi"), validacao.error.details)
        res.sendStatus(422);
        return;
    }
    next();
}