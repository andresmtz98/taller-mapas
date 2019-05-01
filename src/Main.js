import { MapView, Marker } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Colors, RadioButton, Text, Caption, Button } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';

const GEOLOCATING_API_KEY = "AIzaSyAgvUMnOIDhz9acX6a31-17f2sac3v9tbM";

export default class Main extends Component {

  state = {
    tipoFiltro: 1,
    nombre: '',
    latitud: null,
    longitud: null,
    direccion: '',
    buscando: false,
    markerCoord: null,
  }

  componentDidMount = () => {
    Geocoder.init(GEOLOCATING_API_KEY, { language: 'es' });
  }

  _onBuscarPress = async () => {
    this.setState({ buscando: true });
    await Geocoder.from(this.state.direccion)
      .then(response => {
        this.setState({ buscando: false });
        console.log(response)
        if (response.results && response.results.length) {
          this.setState({
            markerCoord: {
              latitude: response.results[0].geometry.location.lat,
              longitude: response.results[0].geometry.location.lng,
            }
          })
          this._mapView.animateToCoordinate(
            {
              latitude: response.results[0].geometry.location.lat,
              longitude: response.results[0].geometry.location.lng,
            }
          ) 
        }                 
      })
      .catch(error => {
        this.setState({ buscando: false });
        console.log(error)
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: .6 }}>
          <View style={styles.vistaBorde}>
            <View style={[styles.vistaInputs, { flex: .4 }]}>
              <TextInput
                label="Nombre"
                onChangeText={nombre => this.setState({ nombre })}
                style={styles.textInput}
                theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                underlineColor={Colors.blue300}
                value={this.state.nombre}
              />
            </View>            
            <View style={[styles.vistaInputs, { flex: .3, justifyContent: 'center', alignContent: 'center' }]}>
              <RadioButton.Group
                onValueChange={value => this.setState({ tipoFiltro: value })}
                value={this.state.tipoFiltro}>
                <View style={styles.vistaRadio}>
                  <Caption style={styles.caption}>Coordenadas</Caption>
                  <RadioButton value={1} theme={{ colors: { accent: Colors.blue300, } }} uncheckedColor={Colors.blue300} />
                </View>
                <View style={styles.vistaRadio}>
                  <Caption style={styles.caption}>Dirección</Caption>
                  <RadioButton value={2} theme={{ colors: { accent: Colors.blue300, } }} uncheckedColor={Colors.blue300} />
                </View>
              </RadioButton.Group>
            </View>            
            <View style={[styles.vistaInputs, { flex: .4 }]}>
              {
                this.state.tipoFiltro == 1 ?
                <React.Fragment>
                  <TextInput
                    keyboardType="number-pad"
                    label="Latitud"
                    onChangeText={latitud => this.setState({ latitud })}
                    style={[styles.textInput, { marginRight: '2%' }]}
                    theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                    underlineColor={Colors.blue300}
                    value={this.state.latitud}
                  />
                  <TextInput
                    keyboardType="number-pad"
                    label="Longitud"
                    onChangeText={longitud => this.setState({ longitud })}
                    style={styles.textInput}
                    theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                    underlineColor={Colors.blue300}
                    value={this.state.longitud}
                  />
                </React.Fragment> :
                  <TextInput
                  label="Dirección"
                  onChangeText={direccion => this.setState({ direccion })}
                  style={styles.textInput}
                    theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
                    underlineColor={Colors.blue300}
                    value={this.state.direccion}
                  />
              }
            </View>
          </View>
          <View style={[styles.vistaInputs, { flex: .2, justifyContent: 'space-between' }]}>
            <Button
              icon="playlist-add"
              mode="text"
              onPress={() => {}}
              theme={{ colors: { primary: Colors.blue300 } }}>
              Guardar
            </Button>
            <Button
              icon="map"
              loading={this.state.buscando}
              mode="text"
              onPress={this._onBuscarPress}
              theme={{ colors: { primary: Colors.blue300 } }}>
              Buscar
            </Button>
            <Button
              icon="view-list"
              mode="text"
              onPress={() => {}}
              theme={{ colors: { primary: Colors.blue300 } }}>
              Listar
            </Button>
          </View>
        </View>
        <MapView           
          followsUserLocation={true}
          ref={ref => { this._mapView = ref }}
          showsMyLocationButton={true}
          showsUserLocation={true}
          style={{ flex: 1 }}>
          {/* {this.state.markerCoord != null &&
            <Marker
              coordinate={this.state.markerCoord}
            />
          } */}
        </MapView>
      </View>
    )
  }
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
