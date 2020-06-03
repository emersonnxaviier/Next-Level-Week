import knex from 'knex';
import path from 'path';

const connection = knex({ //informações sobre o banco de dados.
    client: 'sqlite3',
    connection:{
        filename:  path.resolve(__dirname, 'database.sqlite' ),   // arquivo que vai armazenar o arquivo de banco de dados / path.resolve( ) une caminhos / dentro de database vai criar um arquivo chamado sqlite.
    },
    useNullAsDefault: true, 
});

export default connection;