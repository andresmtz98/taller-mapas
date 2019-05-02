import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Colors, Text } from 'react-native-paper';
import DataBase from '../helpers/DataBase';
import { FlatList } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';

const conexion = new DataBase('tallermapas');

export default Listado = props => {

  const [buscando, setBuscando] = useState(true);
  const [listaSitios, setListaSitios] = useState([]);

  useEffect(() => {
    const buscarSitios = async () => {
      conexion.db.transaction(t => {
        setBuscando(false);
        const tempSitios = [];
        t.executeSql("SELECT * FROM Sitios;", [],
          (t, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              tempSitios.push(results.rows.item(i))
            }
            setListaSitios(tempSitios);
          })
      })
    }

    buscarSitios();
  }, [])

  const renderItem = ({ item }) => (
    <View style={{ maxHeight: 200, backgroundColor: 'rgba(0,0,0,.3)', }}>
      <Text style={{ color: Colors.blue300, padding: 5 }}>{item.nombre}</Text>
      <MapView
        initialCamera={{
          altitude: 10,
          center: {
            latitude: item.latitud,
            longitude: item.longitud
          },
          heading: 10,
          pitch: 3,
          zoom: 10
        }}
        liteMode
        minZoomLevel={15}
        loadingEnabled        
        style={{ height: 150 }}
      >
        <Marker 
          coordinate={{
            latitude: item.latitud,
            longitude: item.longitud
          }}
        />
      </MapView>
    </View>
  )

  const listEmptyComponent = () => (
    <View style={styles.container}>
      <Text style={{ color: Colors.white, textAlign: 'center' }}>No existen sitios para mostrar</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {
        buscando ? <ActivityIndicator size="large" color={Colors.blue300} /> :
          <FlatList            
            data={listaSitios}
            keyExtractor={(item, i) => i.toString()}
            ListEmptyComponent={listEmptyComponent}            
            renderItem={renderItem}            
          />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});