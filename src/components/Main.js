import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import { Button, Caption, Colors, RadioButton, Snackbar, TextInput } from 'react-native-paper';
import DataBase from '../helpers/DataBase';
import Sitio from '../helpers/SitioModel';

const GEOLOCATING_API_KEY = "AIzaSyAgvUMnOIDhz9acX6a31-17f2sac3v9tbM";
const conexion = new DataBase('tallermapas');

export default Main = props => {

  const [tipoFiltro, setTipoFiltro] = useState('1');
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [direccion, setDireccion] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [markerCoord, setMarkerCoord] = useState(null);
  const [snackbarProps, setSnackbarProps] = useState({
    visible: false,
    text: undefined,
    style: undefined,
    duration: undefined,
  });

  useEffect(() => {
    Geocoder.init(GEOLOCATING_API_KEY, { language: 'es' });
    conexion.createTable();
  }, [])

  const _onBuscarPress = async () => {
    setBuscando(true);    
    if (tipoFiltro == '2')
      await Geocoder.from(direccion)
        .then(response => {
          setBuscando(false);          
          if (response.results && response.results.length) {
            setMarkerCoord({
              latitude: response.results[0].geometry.location.lat,
              longitude: response.results[0].geometry.location.lng,
            })
            this._mapView.animateCamera(
              {
                center: {
                  latitude: response.results[0].geometry.location.lat,
                  longitude: response.results[0].geometry.location.lng,
                }
              }
            )
          }
        })
        .catch(error => {
          setBuscando(false);
          console.log(error)
        });
    else {
      setBuscando(false);
      const long = parseFloat(longitud);
      const lat = parseFloat(latitud);
      if (!isNaN(long) && !isNaN(lat)) {
        setMarkerCoord({
          latitude: lat,
          longitude: long,
        })
        this._mapView.animateCamera(
          {
            center: {
              latitude: lat,
              longitude: long,
            }
          }
        )
      } else {
        setSnackbarProps({
          ...snackbarProps,
          text: 'Latitud o longitud incorrecta.',
          visible: true,
          style: { backgroundColor: Colors.grey800 },
        })
      }      
    }
  }

  const _onGuardarPress = async () => {
    const long = parseFloat(longitud);
    const lat = parseFloat(latitud);
    if (tipoFiltro == '1' && (isNaN(long) || isNaN(lat)) ) {
      setSnackbarProps({
        ...snackbarProps,
        text: 'Latitud o longitud incorrecta.',
        visible: true,
        style: { backgroundColor: Colors.grey800 },
      });
      return;
    }
    setGuardando(true);
    const sitio = new Sitio(nombre, tipoFiltro == '1' ? lat : markerCoord.latitude, 
      tipoFiltro == '1' ? long : markerCoord.longitude);
    await conexion.db.transaction(t => {
      t.executeSql("INSERT INTO Sitios (nombre, latitud, longitud) VALUES \
      (?,?,?);", [sitio.nombre, sitio.latitud, sitio.longitud],
        (t, result) => {
          setGuardando(false);
          if (result.rowsAffected) {
            setSnackbarProps({
              ...snackbarProps,
              text: 'Se guardó el registro en la base de datos con éxito.',
              visible: true,
              style: { backgroundColor: Colors.greenA700 },
            });
            setNombre('');
            setLongitud('');
            setLatitud('');
            setDireccion('');
          }            
          else
            setSnackbarProps({
              ...snackbarProps,
              text: 'No se pudo guardar el registro en la base de datos.',
              visible: true,
              style: { backgroundColor: Colors.orangeA400 },
            })
        },
        (t, error) => {
          console.error(error);
          setGuardando(false);
          setSnackbarProps({
            ...snackbarProps,
            text: 'No se pudo guardar el registro en la base de datos.',
            visible: true,
            style: { backgroundColor: Colors.orangeA400 },
          });
        })
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, maxHeight: 280 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.vistaBorde}>
            <View style={[styles.vistaInputs, { flex: .4 }]}>
              <TextInput
                label="Nombre"
                onChangeText={setNombre}
                style={styles.textInput}
                theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                underlineColor={Colors.blue300}
                value={nombre}
              />
            </View>
            <View style={[styles.vistaInputs, { flex: .3, justifyContent: 'center', alignContent: 'center' }]}>
              <RadioButton.Group
                onValueChange={setTipoFiltro}
                value={tipoFiltro}>
                <View style={styles.vistaRadio}>
                  <Caption style={styles.caption}>Coordenadas</Caption>
                  <RadioButton value={'1'} theme={{ colors: { accent: Colors.blue300, } }} uncheckedColor={Colors.blue300} />
                </View>
                <View style={styles.vistaRadio}>
                  <Caption style={styles.caption}>Dirección</Caption>
                  <RadioButton value={'2'} theme={{ colors: { accent: Colors.blue300, } }} uncheckedColor={Colors.blue300} />
                </View>
              </RadioButton.Group>
            </View>
            <View style={[styles.vistaInputs, { flex: .4 }]}>
              {
                tipoFiltro == 1 ?
                  <React.Fragment>
                    <TextInput
                      keyboardType="number-pad"
                      label="Latitud"
                      onChangeText={setLatitud}
                      style={[styles.textInput, { marginRight: '2%' }]}
                      theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                      underlineColor={Colors.blue300}
                      value={latitud}
                    />
                    <TextInput
                      keyboardType="number-pad"
                      label="Longitud"
                      onChangeText={setLongitud}
                      style={styles.textInput}
                      theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                      underlineColor={Colors.blue300}
                      value={longitud}
                    />
                  </React.Fragment> :
                  <TextInput
                    label="Dirección"
                    onChangeText={setDireccion}
                    onSubmitEditing={_onBuscarPress}
                    style={styles.textInput}
                    theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                    underlineColor={Colors.blue300}
                    value={direccion}
                  />
              }
            </View>
          </View>
          <View style={[styles.vistaInputs, { flex: .2, justifyContent: 'space-between' }]}>
            <Button
              icon="playlist-add"
              loading={guardando}
              mode="text"
              onPress={_onGuardarPress}
              theme={{ colors: { primary: Colors.blue300 } }}>
              Guardar
            </Button>
            <Button
              icon="map"
              loading={buscando}
              mode="text"
              onPress={_onBuscarPress}
              theme={{ colors: { primary: Colors.blue300 } }}>
              Buscar
            </Button>
            <Button
              icon="view-list"
              mode="text"
              onPress={() => { props.navigation.navigate('Listado') }}
              theme={{ colors: { primary: Colors.blue300 } }}>
              Listar
            </Button>
          </View>
        </View>
      </ScrollView>
      <MapView
        followsUserLocation={true}
        ref={ref => { this._mapView = ref }}
        showsMyLocationButton={true}
        showsUserLocation={true}
        style={{ flex: 1.3 }}>
        {markerCoord != null &&
          <Marker
            coordinate={markerCoord}
          />
        }
      </MapView>
      <Snackbar
        duration={snackbarProps.duration}
        onDismiss={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        style={snackbarProps.style}
        visible={snackbarProps.visible}>
        {snackbarProps.text}
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  vistaInputs: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 60,
    backgroundColor: 'transparent',
  },
  vistaBorde: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderColor: Colors.blue300,
    borderWidth: .7,
    borderRadius: 5,
    margin: 10,
  },
  vistaRadio: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  caption: {
    color: Colors.white,
    fontWeight: '400',
  },
});
