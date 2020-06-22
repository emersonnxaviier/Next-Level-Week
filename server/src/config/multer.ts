/*
    O destination:  é o local do sistema que armazenaram os arquivos enviados pelo usuário.

    O __dirname retorna o diretório desse mesmo arquivo que é a pasta config.

    O filename é uma função que tem o request para ter acesso as requisições que estão vindo do front-end, o file
    são os dados do arquivo, e o callback que é uma função chamada quando termina de processae o filename.

    O originalname é o nome original do arquivo passado pelo usuário.
*/
import multer from 'multer';// usada para fazer o upload dos arquivos.
import path from 'path'; //vem junto com o node.
import crypto from 'crypto'; //vem junto com o node.


export default{

    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto.randomBytes(6).toString('hex'); //gera 6 bytes de caracteres aleatórios, e converte para uma string hexadecimal.
            
            const fileName = `${hash}-${file.originalname}`; //esse será o formato para o nome dos arquivos enviados.
            
            callback(null, fileName);
        }
    }),
};