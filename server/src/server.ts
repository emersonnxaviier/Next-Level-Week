import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import {errors} from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json()); //para entender o formato json e receber informações do request body.
app.use(routes);

//para acessar as imagens
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads' )));


// lida com os erros enviados para o front-end.
app.use(errors()); 


app.listen(3333);







/* express.static(X) - utilizada para servir arquivos estáticos de uma pasta específica, sendo X o caminho da pasta,
e quando lidamos com caminhos utiliza-se o path.

comecando com o __dirname que é o diretorio atual, voltando uma pasta, e acessa a pasta uploads.
*/