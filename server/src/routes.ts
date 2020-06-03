import express, { request, response } from 'express';
import PointsController from '../src/controllers/pointsController';  //importando a classe PointesController.
import ItemsController from '../src/controllers/itemsController';  //importando a classe ItemsController.


const routes = express.Router(); //serve para desacoplar as rotas do arquivo principal para outro arquivo. agr o routes funciona da mesma forma que o app funcionava.

const pointsController = new PointsController(); // estância a classe.
const itemsController = new ItemsController(); // estância a classe.


// LISTAR TODOS OS ITENS
routes.get('/items', itemsController.index); //index nome do método da classe.


// CADASTRAR PONTOS DE COLETA
routes.post('/points', pointsController.create ); //create nome do método da classe.

// LISTAR TODOS OS PONTOS DE COLETA
routes.get('/points', pointsController.index ); //index nome do método da classe.

//LISTAR PONTO DE COLETA ESPECÍFICO
routes.get('/points/:id', pointsController.show ); //show nome do método da classe utilizado para listar um único ponto.


export default routes; //exporta para ter acesso no server.ts