import { MapView } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Colors } from 'react-native-paper';

export default class Main extends Component {

  state = {

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={[styles.vistaInputs, { flex: .5 }]}>
            <TextInput 
              style={styles.textInput} 
              label="Nombre"
              theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}
              underlineColor={Colors.blue300}
            />
          </View>
          <View style={[styles.vistaInputs, { flex: .5 }]}>                        
            <TextInput 
              style={[styles.textInput, { marginRight: '2%' }]} 
              label="Latitud" 
              theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}                 
              underlineColor={Colors.blue300}
            />
            <TextInput 
              style={styles.textInput} 
              label="Longitud" 
              theme={{ colors: { primary: Colors.blue300, text: Colors.white, placeholder: Colors.white } }}                 
              underlineColor={Colors.blue300}
            />
          </View>
          <View style={styles.vistaInputs}>
            <TextInput style={styles.textInput} />
            <TextInput style={styles.textInput} />
          </View>
        </View>
        <MapView           
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
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
});
