import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
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
      })
    })
  }

  render(){
    const {isLoading, errMsg, location, weather} = this.state;
    const text = isLoading ? "Chargement" : errMsg ? errMsg : '';
    const k = 273.15;
    const picto = weather ? weather.weather[0].icon : "";

    return(
      <View style={styles.container}>
        <Text>{text}</Text>
        <View style={styles.weather}>
          <View>
            <Image
              style={{width: 100, height: 100}}
              source={{uri: `http://openweathermap.org/img/w/${picto}.png`}}
            />
          </View>
          <View>
            <Text style={styles.weatherTemp}>{weather ? Math.floor(weather.main.temp - k) + '°C' : ''}</Text>
          </View>
          <Text style={styles.weatherName}>{weather ? weather.name : ''}</Text>
          <View style={[styles.row, styles.rowTemp]}>
            <Text style={styles.weatherMaxTemp}>{weather ? 'Temp Max: ' + Math.floor(weather.main.temp_max - k) + '°C' : ''}</Text>
            <Text style={styles.weatherMinTemp}>{weather ? 'Temp Min: ' + Math.floor(weather.main.temp_min - k) + '°C' : ''}</Text>
          </View>
        </View>
        <View style={styles.signature}>
            <Text style={styles.signatureContent}>Alex.js</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowTemp: {
    justifyContent: 'space-around',
  },
  weather: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weatherTemp: {
    fontSize: 100
  },
  weatherName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 10
  },
  weatherMaxTemp: {
    marginRight: 2,
    fontSize: 15,
    fontWeight: 'bold'
  },
  weatherMinTemp: {
    marginLeft: 2,
    fontSize: 15,
    fontWeight: 'bold'
  },
  signature: {
    flex: 0.1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  signatureContent: {
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});
