<p align="center">
    <h1 align="center">
        MyWallet API
    </h1>
</p>

 - O mywallet é uma carteira para registro e controle financeiro.

 ## 💻 Tecnologias Utilizadas

- JavaScript
- Node
- Mongo
- joi

## Schema Mongo

- Collection "usuarios" : 

```yml
fields
    - id
    - nome
    - email
    - senha
```

- Collection "sessoes" : 

```yml
fields
    - id
    - usuarioId
    - token
```

- Collection "registros" : 

```yml
fields
    - id
    - tipo
    - data
    - valor
    - descricao
    - usuarioId
```

## 👨🏻‍💻 Instalação

```bash

$ git clone https://github.com/BrunooBarross/mywallet-api

```

- crie um arquivo .env conforme específicado no .env-example
- abra um terminal na pasta do projeto

```bash

$ npm i

$ npm start

```

## 🚀 API:

```yml
POST /signup
    - Rota para cadastro de usuários
    - headers: {}
    - body: {
        "nome": String 
        "email": email@dominio.com
        "senha": 
        "verificarSenha":
    }
```

```yml
POST /sign-in
    - Rota de login
    - headers: {}
    - body: {
        "email": email@dominio.com
        "senha": 
    }
```

```yml
POST /registro
    - Rota para adicionar um registro
    - headers: { "Authorization": "Bearer ${token}" }
    - body: {
        "tipo": String ("entrada", "saida")
        "data": "dd/MM"
        "valor": String
        "descricao": String
    }
```

```yml
GET /registro
    - Rota buscar todos os registros
    - headers: { "Authorization": "Bearer ${token}" }
    - body: {}
```

```yml
DELTE /registro/:id
    - Rota para deletar um registro através do id
    - headers: { "Authorization": "Bearer ${token}" }
    - body: {}
```