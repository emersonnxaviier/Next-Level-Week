/*
    se fosse preciso colocar mais de um arquivo no input colocaria um multiple.
*/
import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

import './style.css';
import { FiUpload} from 'react-icons/fi'; // importa uma imagem de upload.


// tipo da função do Dropzone, recebe um arquivo retornando nada.
interface Props{
onFileUploaded:(file: File) => void;
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        
        const file = acceptedFiles[0]; //posição zero pois é uma única imagem portanto estará sempre na posição zero.

        //para criar uma url da imagem.
        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
        
    }, [onFileUploaded]) //executa essa função sempre que essa variável for alterada.

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: 'image/*' //para permitir apenas upload de imagens em todos os tipos.
    });

    return(
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} accept="image/*"/> 

            {
                selectedFileUrl
                 ?
                  <img src={selectedFileUrl} alt="imagem do ponto"/> 
                  :
                  (
                    <p>
                        <FiUpload/>
                        Imagem do estabelecimento
                    </p>
                  )
            }

        </div>
    )
}

export default Dropzone;