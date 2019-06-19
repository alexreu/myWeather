import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'

export default class App extends React.Component {
  state = {
    location: null,
    isLoading: true,
    errMsg: null
  }

  componentWillMount(){
    this._getLocation();
  }

  _getLocation = async () => {
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({isLoading: true})
    if(status !== 'granted') {
      this.setState({
        errMsg: 'Veuillez autorisé l\'utilisation de la localisation GPS',
        isLoading: false
      })
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      location,
      isLoading: false
    })
  };

  render(){
    console.log(this.state.location)
    const {isLoading, errMsg, location} = this.state;
    const text = isLoading ? "Chargement" : errMsg ? errMsg : JSON.stringify(location); 
    return(
      <View style={styles.container}>
        <Text>{text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
