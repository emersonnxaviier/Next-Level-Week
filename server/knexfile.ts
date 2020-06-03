import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename:  path.resolve(__dirname, 'src', 'database', 'database.sqlite' ),   // aqui 
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations' )
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds' )
    },
    useNullAsDefault: true, 
};

/* o __dirname é uma variável global que vai retornar o diretório do arquivo que está executado essa variável. 
Como está sendo chamada dentro do arquuivo connection ela vai retornar o caminho para o diretorio database que é 
onde está o arquivo connection. */

/* arquivo que vai armazenar o arquivo de banco de dados / path.resolve( ) une caminhos / no diretorio raiz que é o
knexfile vai acessar o diretorio src e vai acessar o diretorio database e dentro de database vai criar um arquivo 
chamado sqlite.*/