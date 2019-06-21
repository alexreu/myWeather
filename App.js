import React from 'react';
import { StyleSheet, Text, View, Image, Button, ToolbarAndroid, NetInfo, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faRedo} from '@fortawesome/free-solid-svg-icons';


export default class App extends React.Component {
  state = {
    location: null,
    isLoading: true,
    errMsg: null,
    weather: null,
    connection: null
  }

  // initialize component
  async componentDidMount(){
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
    let connectionInfo = await NetInfo.getConnectionInfo();
    this.setState({connection: connectionInfo.type})
    if(this.state.connection === 'wifi' || this.state.connection === 'cellular'){
      this.getLocationAndWeather();
    }
  }

  // handle connection change
  handleConnectionChange = connectionInfo => {
    if(this.state.connection !== connectionInfo.type){
      if(connectionInfo.type === 'none'){
        this.setState({connection: connectionInfo.type, weather: null, location: null, errMsg: "Check your connection"})
      }else {
        this.setState({connection: connectionInfo.typen, errMsg: null})
        this.getLocationAndWeather();
      }
    }
  }

  // get location and get weather after get gps coords
  getLocationAndWeather = async () => {
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted') {
      this.setState({
        errMsg: 'Veuillez autorisé l\'utilisation de la localisation GPS',
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

  // get weather with api call
  getWeather = (lat, lon) => {
    axios.get(`http://api.apixu.com/v1/current.json?key=e28cc67df3d142628ba64118191906&q=${lat},${lon}`)
    .then(weather => {
      this.setState({
        weather: weather.data,
      })
    })
  }


  // handle click for refresh weather
  handleClick = async () => {
    this.setState({weather: null, location: null, errMsg: null})
    let connection = NetInfo.getConnectionInfo();
    if(connection.type !== 'none'){
      this.getLocationAndWeather();
    }
  };

  // display pop up for informations
  getInformation = position => {
    if(position === 0 ){
      Alert.alert(
        'Information',
        'Information météo proposé par APIXU Developper par Alex.js',
        [
          {text: 'OK'},
        ],
        {cancelable: false},
      );
    }
  }

  render(){
    const {isLoading, errMsg, weather} = this.state;
    const text = !weather ? errMsg ? errMsg : "Chargement..."  : '';
    const picto = weather ? weather.current.condition.icon : "";
    return(
          !weather ? (
            <View style={styles.container}>
              <View style={styles.weatherLoadingrow}>
                <Text style={styles.weatherLoadingContent}>{text}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.toolbarContainer}>
                <ToolbarAndroid
                  title="Météo"
                  actions={[{title: 'ℹ️', show: 'always'}]}
                  style={styles.toolBar}
                  onActionSelected={this.getInformation} 
                  titleColor="#FFFFFF"
                />
              </View>
              <View style={styles.weather}>
                <View style={styles.row}>
                  <Image
                    style={styles.weatherPicto}
                    source={{uri: `http:${picto}`}}
                  />
                  <Text style={styles.weatherTemp}>{weather ? weather.current.temp_c + '°C' : ''}</Text>
                </View>
                <Text style={styles.weatherName}>{weather ? weather.location.name : ''}</Text>
                <View style={[styles.row, styles.rowTemp]}>
                  <Text style={styles.weatherTempFeel}>{weather ? 'Ressenti: ' + weather.current.feelslike_c + '°C' : ''}</Text>
                </View>
                <FontAwesomeIcon icon={ faRedo } color={'#FFFFFF'} size={20} onPress={this.handleClick} />
              </View>
              <View style={styles.weatherWindView}>
                <Text style={styles.weatherContent}>Informations</Text>
                <Text style={styles.weatherContent}>{weather ? 'Vent: ' + weather.current.wind_degree + '° / ' + weather.current.wind_dir : ''}</Text>
                <Text style={styles.weatherContent}>{weather ? 'Vitesse du vent: ' + weather.current.wind_kph + ' km/h' : ''}</Text>
                <Text style={styles.weatherContent}>{weather ? 'Humidité: ' + weather.current.humidity + ' %' : ''}</Text>
                <Text style={styles.weatherContent}>{weather ? 'Précipitations: ' + weather.current.precip_mm + ' mm' : ''}</Text>
                <Text style={styles.weatherContent}>{weather ? 'Indice UV: ' + weather.current.uv : ''}</Text>
              </View>
              <View style={styles.signature}>
                  <Text style={styles.signatureContent}>Create by Alex.js</Text>
              </View>
            </View>
          )
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#000000'
  },
  toolbarContainer: {
    height: 24
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  rowTemp: {
    justifyContent: 'space-around',
    marginBottom: 30
  },
  weatherLoadingrow: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center'
  },
  weatherLoadingContent: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20
  },
  weather: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weatherTemp: {
    fontSize: 70,
    color: '#FFFFFF',
  },
  weatherName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 10,
    color: '#FFFFFF'
  },
  weatherTempFeel: {
    marginRight: 2,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  weatherMinTemp: {
    marginLeft: 2,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  weatherPicto: {
    height: 100,
    width: 100,
  },
  weatherWindView: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(102,102,102,0.5)',
    width: '85%',
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  weatherTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  weatherContent: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 2
  },
  signature: {
    flex: 0.1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  signatureContent: {
    fontSize: 5,
    fontWeight: 'bold',
    color: '#666666'
  },
  toolBar: {
    backgroundColor: 'gray',
    height: 50,
    color: "#FFFFFF",
    marginTop: Constants.statusBarHeight
  }
});
