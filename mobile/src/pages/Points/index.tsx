/*
  uri: é utilizado quando uma imagem vem de maneira externa.

  O SafeAreaView ele faz automaticamente o espaço(padding) da parte de baixo(footer) e do StatusBar.

  Sempre que armazena um vetor no estato(useStates), é preciso informar qual que é o formato desse vetor.

*/

import React, {useState, useEffect }  from 'react';
import {Feather as Icon } from '@expo/vector-icons'; // está renomeando Feather para Icon.
import { useNavigation } from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';   // para usar o mapa.
import { SvgUri} from 'react-native-svg'; //permite carregar um svg externo.
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import api from '../../services/api';
import * as Location from 'expo-location'; //todas as funções do pacote estarão na variável Location.


// formato das imagens
interface Item{
  id: number;
  title: string;
  image_url: string;
}

//formato dos pontos de coleta
interface Point{
  id: number;
  name: string;
  image: string,
  latitude: number;
  longitude: number;
}


const Points = () =>{

// armazena as imagens dentro de um vetor pois é mais de uma.
const [items, setItems] = useState <Item[]> ([]);

// armazena os pontos de coleta. 
const [points, setPoints] = useState <Point[]> ([]);

// armazena quais itens foram selecionados.
const [selectItems, setSelectItems] = useState <number[]> ([]); //array numerico, recebe apenas os IDs.

// armazena a posição inicial do usuário.
const [initialPosition, setInitialPosition] = useState <[number, number]> ([0, 0]);


const navigation = useNavigation();


// volta a tela anterior.
function handleNavigateBack(){
    navigation.goBack(); 
}

// vai para a tela de detalhes.
function handleNavigateToDetail( id: number){
  navigation.navigate('Detail', { point_id: id }); 
}

// pegar a localização atual do usuário.
useEffect( () => {
    async function loadPosition(){
      const { status } = await Location.requestPermissionsAsync(); // retorna se o usuário deu permissão ou não.

      if( status !== 'granted'){
          Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização');
          return;  // return vazio pois como não foi dado a permissão não pode executar o restante do código.
      }

      const location = await Location.getCurrentPositionAsync(); //pega a localização do usuário.

      const { latitude, longitude } = location.coords; // latitude e longetude do usuário.
      
      setInitialPosition([
        latitude,
        longitude
      ]);
    }

    loadPosition();
},[]);


// dados dos itens.
useEffect( ()=> { 
    api.get('items').then(response => { 
      setItems(response.data);
    });

},[]);


// dados dos pontos de coleta.
useEffect( () =>{ 

    api.get('points', {
      params:{
        city: 'Macururé',
        uf: 'BA',
        items:[4, 5]
      }

    }).then(response => { setPoints(response.data); })

},[]);


// seleciona e desseleciona os itens
function handleSelectItem(id: number){
    const alreadySelected = selectItems.findIndex(item => item === id);

    if(alreadySelected >= 0){
      const filteredItems = selectItems.filter(item => item !== id);
      setSelectItems(filteredItems);
    }
    else{
      setSelectItems([...selectItems, id]);
    }
}


    return (
        <SafeAreaView style={{ flex: 1 }}> 
        
            <View style={styles.container}>
                <TouchableOpacity>
                    <Icon name="arrow-left" size={25} color="#34cb79" onPress={handleNavigateBack} />
                </TouchableOpacity>

                <Text style={styles.title}> Bem Vindo. </Text>
                <Text style={styles.description}> Encontre no mapa um ponto de coleta. </Text>



                <View style={styles.mapContainer}>
                    { initialPosition[0] !== 0 && (

                <MapView 
                    style={styles.map} 
                    initialRegion={{
                      latitude:  initialPosition[0],       //-9.3989977 
                      longitude:  initialPosition[1],      //-38.2197148
                      latitudeDelta: 0.014, //pode utilizar para qualquer aplcação se quiser.
                      longitudeDelta: 0.014 //pode utilizar para qualquer aplcação se quiser.
                    }}  
                >

              { points.map(point => (

                <Marker 
                    key ={String(point.id)}
                    onPress={ () => handleNavigateToDetail(point.id)}
                    style={styles.mapMarker}
                    coordinate ={ 
                    { latitude: point.latitude,
                      longitude: point.longitude, }} 
                >

                  <View style={styles.mapMarkerContainer}>
                        <Image style={ styles.mapMarkerImage} source={ { uri: point.image } }/>
                        <Text style={styles.mapMarkerTitle}> {point.name} </Text>
                  </View>

              </Marker>

              ) )} 

                </MapView>

                            )} 
                </View>
            </View>

            
            <View style={styles.itemsContainer}> 
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={ { paddingHorizontal: 20 } } 
                >

                  {items.map( item => (
                        <TouchableOpacity  
                          key={String(item.id)}   
                          style={[ styles.item,    //no react-native é possível passar um vetor com vários estilos do segundo em diante sendo aplicados com uma condição.
                          selectItems.includes(item.id) ? styles.selectedItem : {} //se dentro do selectItems tiver o id desse items aplique tal estilo, se não, não faça nada.
                          ]}  
                          onPress={() => handleSelectItem(item.id)} 
                          activeOpacity={0.5}
                        >
                            
                            <SvgUri width={42}  height={42} uri={item.image_url} />
                            <Text style={ styles.itemTitle }> {item.title} </Text>

                        </TouchableOpacity>
                  ))}
                   
                </ScrollView>
            </View>
        </SafeAreaView> 
    ); 
};


// estilos/css da página Points que são chamadas a cima.
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 29,
      paddingTop: 50 
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 11,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 110,
      width: 110,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;