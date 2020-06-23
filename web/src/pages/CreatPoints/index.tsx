import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './style.css';
import logo from '../../assets/logo.svg';
import {Link, useHistory} from 'react-router-dom';  //serve para a página não recarregar por completo.
import {FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker} from 'react-leaflet'; //importações para usar o mapa.
import api from '../../services/api'; 
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet'; //para selecionar a localidade no mapa.

import Dropzone from '../../components/Dropzone';


 // informa o tipo da variável que vai ser armazenada os Items.
 interface Item{
    id: number;
    title: string;
    image_url: string;
}

// informa o tipo da variável que vai ser armazenada para as UF.
interface IBGEUFResponse{
    sigla: string;
}

// informa o tipo da variável que vai ser armazenada para as City.
interface IBGECityResponse{
    nome: string;
}


const CreatPoint = ()=> {


    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]); //usado para a posição atual do usuário.

    const [ formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    //armazena os itens.
    const [items, setItems] = useState<Item[]>([]);

    //armazena as UFs.
    const [ufs, setUfs] = useState<string[]>([]);

    //armazena a informação de qual estado está selecionado.
    const [selectedUf, setSelectedUf] = useState('0'); // 0 pois é o mesmo valor do option que não tem nada / e é responsável por saber qual UF o usuário selecionou.
     
    const [cities, setCities] = useState<string[]>([]);
    
    //armazena a informação de qual cidade está selecionada.
    const [selectedCity, setSelectedCity] = useState('0');

    //armazena a informação do ponto marcado no mapa.
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]); //usado para selecionar a posição no mapa.
    
    //armazena a informação de quais itens estão selecionados.
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    
    //armazena a informação de se  imagem foi ou não adicionada.
    const [selectedFile, setSelectedFile] = useState<File>();


    //permitir navegar de um ambiente para outro sem ter um botão. 
    const history = useHistory();


    //vai disparar assim que a tela for carregada
    useEffect( ()=>{
        navigator.geolocation.getCurrentPosition(position =>{   //vai retornar a posição inicial do usuário assim que abrir a aplicação.
            const {latitude, longitude} = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    });

    // carregar cada item uma única vez
    useEffect(() =>{ 
            
        api.get('items').then( response =>{ // items é o recurso da rota para listar os itens.
            setItems(response.data);
        });

    }, []);

    // carregar os estados uma única vez
    useEffect( ()=>{

        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{

            const ufInitials = response.data.map( uf => uf.sigla);

            setUfs(ufInitials);
        });

    }, []);

    // carregar as cidades sempre que a UF mudar 
    useEffect(() =>{ 
        if(selectedUf === '0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response =>{
           
        const cityName = response.data.map( city => city.nome);

            setCities(cityName);

        });
        
    }, [selectedUf]);

    // vai ser umachamada toda vez que o usuário mudar de UF
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
            const uf = event.target.value;

            setSelectedUf(uf);
    }

    // vai ser uma chamada toda vez que o usuário mudar de cidade
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
}

    //função para selecionar o ponto de localidade no mapa.
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    //armazenar os inputs
    function handleInputChange( event: ChangeEvent<HTMLInputElement>){

        const { name, value} = event.target;

        setFormData({...formData, [name]: value });
    }

    //selecionar e desconsiderar os itens
    function handleSelectItem(id: number){

        const alreadySelected = selectedItems.findIndex(item => item === id);
        
        if (alreadySelected >= 0){

            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }
        else{
        setSelectedItems([...selectedItems, id]);
        }
    }

    //faz o envio para API do novo ponto de coleta
    async function handleSubmit(event: FormEvent){
        event.preventDefault(); // quando clicar no enter não recarregar.

        

        //dados que serão enviados para a API
        const { name, email, whatsapp} = formData;
        const   uf   = selectedUf;
        const   city   = selectedCity;
        const [ latitude, longitude] =  selectedPosition;
        const   items   =   selectedItems;

        //como o formato dos dados não é json deve ser feito dessa forma.
        const data = new FormData();

        data.append('name',name);
        data.append('email',email);
        data.append('whatsapp',whatsapp);
        data.append('uf',uf);
        data.append('city',city);
        data.append('latitude',String(latitude));
        data.append('longitude',String(longitude));
        data.append('items',items.join(','));

        if(selectedFile){
        data.append('image', selectedFile); 
        }
       

        await api.post('points', data);

        alert('Ponto de coleta criado!!');

        //após cadastrar os dados retorna para a página Home.
        history.push('/');

    }


    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/" >
                    <FiArrowLeft/>
                    Voltar para a home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1> Cadastro do <br/> ponto de coleta </h1>


                <Dropzone onFileUploaded={setSelectedFile} />
                

                {/*DADOS */}
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name"> Nome da entidade </label>
                        <input type="text" name="name" id="name"  onChange={handleInputChange}/>
                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email"> E-mail </label>
                            <input type="email" name="email" id="email"  onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp"> Whatsapp </label>
                            <input type="text" name="whatsapp" id="whatsapp"  onChange={handleInputChange} />
                        </div>

                    </div>

                </fieldset>

                {/*ENDEREÇO */}
                <fieldset>
                        <legend>
                                <h2> Endereço </h2>
                                <span> Selecione o endereço no mapa </span>
                        </legend>

                        <Map center={initialPosition} zoom={16} onClick={handleMapClick}>  
                            <TileLayer  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> 
                                        contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                            <Marker position={selectedPosition}/> {/*vai selecionar a posição que clicar no mapa */}
                        </Map>

                        <div className="field-group">

                            <div className="field">
                                    <label htmlFor="uf"> Estado (UF) </label>

                                    <select name="uf"  id="uf"   value={selectedUf}     onChange={handleSelectUf}>
                                            <option value="0"> Selecione um UF </option>

                                            { ufs.map(uf => (
                                                    <option key={uf} value={uf}>{uf}</option>
                                            ))}
                                    </select>
                            </div>

                            <div className="field">
                                    <label htmlFor="city"> Cidade </label>
                                    
                                    <select name="city"  id="city"  value={selectedCity}    onChange={handleSelectCity}>
                                            <option value="0"> Selecione uma Cidade </option>

                                            { cities.map(city => (
                                                    <option key={city} value={city}> {city} </option>
                                            ))}
                                    </select>
                            </div>

                        </div>

                </fieldset>

                {/*ITENS */}
                <fieldset>
                        <legend>
                                <h2> Ítens de coleta </h2>
                                <span> Selecione um ou mais ítens abaixo </span>
                        </legend>

                        <ul className="items-grid">
                            {items.map(item => (
                                <li 
                                    key={item.id} 
                                    onClick={ () => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : '' } // se o item for clicado adicione a class selected.
                                    >
                                    <img src={item.image_url} alt={ item.title }/>
                                    <span> {item.title} </span>
                                </li>
                            ))}
                            
                        </ul>
                        
                </fieldset>

                <button type="submit"> Cadastrar ponto de coleta</button>
            </form>

        </div>
    );
};

export default CreatPoint;