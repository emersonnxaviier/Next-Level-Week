

/*  A navegação em pilha é quando consegue chamar as próximas telas através do botão, e as telas anteriores não 
deixam de existir, o usuário consegue voltar para essa tela anterior.

    O NavigationContainer define para as rotas como devem se comportar, portanto devem sempre está por volta da 
aplicação. 

    Para cada tela da aplicação cria um Screen, sendo name o nome da rota e component.o componente que será 
mostrado em tela quando a rota estiver ativa.

    As configurações feitas em AppStack.Navigator serão replicadas para todas as telas.

    O headerMode="none" remove o cabeçalho por completo.
*/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // serve para navegação em pilha.


import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const AppStack = createStackNavigator(); // vai funcionar como o roteamento da aplicação.

//componente de rotas
const Routes = () =>{

    return(
        <NavigationContainer>
                <AppStack.Navigator headerMode="none" screenOptions={{ cardStyle:{ backgroundColor:'#f0f0f5' } }}>
                    <AppStack.Screen name="Home" component={Home} />
                    <AppStack.Screen name="Points" component={Points} />
                    <AppStack.Screen name="Detail" component={Detail} />
                </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes; 