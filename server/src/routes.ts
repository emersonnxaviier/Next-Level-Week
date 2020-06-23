/*
    upload.single() para receber uma única foto.

    upload.array() para receber mais de uma foto.

*/
import express from 'express';

import multer from 'multer';   // biblioteca de uploads.
import multerConfig from './config/multer'; // configurações do upload.
import {celebrate, Joi} from 'celebrate';   //para fazer a validação de dados.

import PointsController from '../src/controllers/pointsController';  //importando a classe PointesController.
import ItemsController from '../src/controllers/itemsController';  //importando a classe ItemsController.


const routes = express.Router(); //serve para desacoplar as rotas do arquivo principal para outro arquivo. agr o routes funciona da mesma forma que o app funcionava.

// configurações do upload.
const upload = multer(multerConfig);



const pointsController = new PointsController(); // estância a classe.
const itemsController = new ItemsController(); // estância a classe.


// LISTAR TODOS OS ITENS
routes.get('/items', itemsController.index); //index é nome do método da classe.

// LISTAR TODOS OS PONTOS DE COLETA
routes.get('/points', pointsController.index ); //index é nome do método da classe.

//LISTAR PONTO DE COLETA ESPECÍFICO
routes.get('/points/:id', pointsController.show ); //show é nome do método da classe utilizado para listar um único ponto.


// CADASTRAR PONTOS DE COLETA
routes.post('/points',
 //fazer o upload de uma unica image.
 upload.single('image'),
 //validar dados.
 celebrate({ 
     body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
     })
 },{
     abortEarly: false, //para validar todos de uma vez só.
 }), 
 pointsController.create ); //create é  nome do método da classe que cria o ponto.


export default routes; //exporta para ter acesso no server.ts