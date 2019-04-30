import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Landing from './src';
import { Colors } from 'react-native-paper';

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', bottom: 'always' }}>
        <Landing />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blueGrey700,
  },
});
