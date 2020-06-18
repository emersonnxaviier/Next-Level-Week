import {Request, Response} from 'express';
import knex from '../database/connection'; //importa a conexão com o banco.


class PointsController{
    

    //LISTAR TODOS OS PONTOS DE COLETA  FILTRADO POR CITY/UF/ITEMS
    async index(request: Request, response: Response) { //informa manualmente os formatos request e response.

        const { city, uf, items} = request.query;

        //filtro
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim())); // transforma items em string e separa cada uma por vírgula eliminando os espaçõs.
    

        const points = await knex('points') //se no filtro receber por exeplo 1 e 2 vai procurar todos os pontos que tem pelo meno 1 item_id dos que está recebendo no filtro.
            .join('point_items', 'points.id', '=', 'point_items.point_id' )
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()    //para retornar somente pontos de coletas distintos e não o mesmo mais de uma vez.
            .select('points.*');

        return response.json(points);
    }

        



    //LISTAR PONTO ESPECÍFICO
    async show(request: Request, response: Response) { //informa manualmente os formatos request e response.

                //desestruturação pois o nome do objeto é o mesmo da variável.
                const { id } = request.params;

                //faz uma busca no banco de dados.
                 const point = knex('points').where('id', id).first();

                // se não encontrar.
                 if(!point){
                    return response.status(400).json({ message: 'Ponto de coleta não encontrado.'});
                 }
                

                //itens que determina o ponto coleta
                const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('items.title');

                //se encontrar retorne o ponto.
                return response.json({ point, items});
                
            }






    // CRIAR PONTO DE COLETA 
    async create(request: Request, response: Response) { //informa manualmente os formatos.

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items    //é um array de itens que cada ponto coleta.
        } = request.body;
    
        const trx = await knex.transaction(); //se uma query falar a outra não executa.
    
        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name, // utilizando short sintaxe, que é quando o nome da variável é igual ao nome da propriedade do objeto é possível emitir.
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        const insertedIds = await trx('points').insert(point);
    
        //RELACIONAMENTO COM A TABELA DE ITENS
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id:number) =>{
            return {
                item_id,
                point_id,
            };
        })
        await trx('point_items').insert( pointItems );

        await trx.commit(); //vai realmente fazer os inserts na base de dados. 

        return response.json({  // retorna as informações do ponto de coleta mais o id.
            point_id,
            ...point
        });
        
        }
}

export default PointsController;  //exporta a classe.