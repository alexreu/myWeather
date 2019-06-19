import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

export default class App extends React.Component {
  state = {
    location: null,
    isLoading: true,
    errMsg: null,
    weather: null
  }

  componentDidMount(){
    this.getLocationAndWeather();
  }

  getLocationAndWeather = async () => {
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
    })

    let weather = await this.getWeather(location.coords.latitude, location.coords.longitude)
    this.setState({
      weather,
      isLoading: false

    })
  };

  getWeather = (lat, lon) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=0a2d09f4b93ddff3e444d2db7b7953b9`)
    .then(weather => {
      this.setState({
        weather: weather.data,
        isLoading: false
      })
    })
  }

  render(){
    const {isLoading, errMsg, location, weather} = this.state;

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
