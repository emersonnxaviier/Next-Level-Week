# Sobre a aplicação

O **Ecoleta** é uma aplicação Web e Mobile para ajudar pessoas a encontrarem pontos que coletam diferentes tipos de resíduos para reciclagem.

# Tecnologias

- Node.js
- React.js
- React Native
- TypeScript
- express

# Como usar

- É obrigatório ter instalado na máquina o **Node.js** juntamente com os gerenciadores de pacote **npm** e/ou **yarn**
- Instalar o **Expo** de forma global na máquina e o aplicativo expo para rodar no mobile.

## Executando a Aplicação:

 ```
    # Entre no repositório
    $ cd Next-Level-Week\server

    # Instale as dependências
    $ npm install

    # Crie o banco de dados
    $ npm run knex:migrate

    # Inicie as imagens dos itens
    $ npm run knex:seed

    # Inicie à API
    $ npm run dev

    # Inicie a aplicação web
    $ cd Next-Level-Week\web
    $ npm start

    # Inicie a aplicação mobile
    $ cd Next-Level-Week\mobile
    $ npm start ou expo start