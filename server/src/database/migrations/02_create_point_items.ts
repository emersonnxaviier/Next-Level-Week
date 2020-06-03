import Knex from 'knex';

// cria a tabela
export async function up(knex: Knex){
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
        table.integer('point_id')  //interger por que o id de points é autoincremente que é interger por padrão.
        .notNullable()
        .references('id')     //para a chave estrangeira
        .inTable('points');  //para a chave estrangeira


        table.integer('item_id') //interger por que o id de items é autoincremente que é interger por padrão.
        .notNullable()
        
        .references('id')     //para a chave estrangeira
        .inTable('items');   //para a chave estrangeira


    });

}

// volta atras (deleta a tabela)
export async function down(knex: Knex){

    return knex.schema.dropTable('items');
}