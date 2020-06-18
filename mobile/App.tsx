import React from 'react';
import Routes from './src/routes';
import {StatusBar} from 'react-native';

import { AppLoading } from 'expo';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';




export default function App() {

  //traz a imformação de quando a font terminou de ser carregada.
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  //mostra sinal de carregamento enquanto as fonts são carregadas.
  if(!fontsLoaded){
    return <AppLoading/>
  }

  //retorna o conteúdo do app.
  return (
    
    // <> chamada de fragment
    <> 
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/> 
      <Routes/>
    </>
  );
}
