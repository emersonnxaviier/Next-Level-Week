import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatPoints';


const Routes = ()=> {
    return(
        <BrowserRouter>

            <Route component={Home} path="/" exact />       {/* O exact vai fazer uma verificação de igualdade, se o caminho da url é igual ao path. */}
            <Route component={CreatePoint} path="/create-point" />

        </BrowserRouter>
    );
}

export default Routes;