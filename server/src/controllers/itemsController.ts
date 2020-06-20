import {Request, Response} from 'express';
import knex from '../database/connection'; //importa a conexão com o banco.

class ItemsController{

    //nome do método igual a index.
    async index(request: Request, response: Response) {  // se utiliza o await deve utilizar o async.

        const items =  await knex('items').select('*'); // da um select para listar tudo da tabela items / sempre que utilizar uma query para o banco de dados precisa utilizar o await na frente.
        //processo de serialização de dados
        const serializedItems = items.map(item =>{
            return{
                id: item.id,
                title: item.title,
                image_url: `http://10.0.1.8:3333/uploads/${item.image}`,  //localhost foi alterado pelo ip da maquina, para testar no mobile.
            }
        });
        return response.json(serializedItems);
    }
}

export default ItemsController;  //exporta a classe.