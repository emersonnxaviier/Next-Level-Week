import React from 'react';
import './style.css';
import logo from '../../assets/logo.svg'; // importa a logo
import {FiLogIn} from 'react-icons/fi';   // importa o icone de logIn
import {Link} from 'react-router-dom';

const Home = ()=>{
    return(

        <div id="page-home">
            <div className="content">  
                <header>
                     <img src={logo} alt="Ecoleta"/>
                </header>

                <main>
                    <h1>Seu marketplace de coleta de reíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to="/create-point">   {/*mesmo nome passado no path do arquivo routes.tsx */}
                        <span>
                           <FiLogIn/>  
                        </span>
                        <strong>
                            Cadastre um ponto de coleta
                        </strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;