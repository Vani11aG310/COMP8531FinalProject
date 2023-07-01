import React, { useEffect } from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid, ScrollView, NativeModules, NativeEventEmitter, Platform, TouchableOpacity, useWindowDimensions, } from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager';
import Geolocation from 'react-native-geolocation-service';
import { useState } from 'react';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const App = () => {
  const peripherals = new Map();
  const [location, setLocation] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [bluetoothDevices, setBluetoothDevices] = useState([]);

  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!')
    });
    BleManager.start({showAlert: false}).then(() => {
      console.log('BLE Manager initialized');
    });
    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('Scan is stopped');
        handleGetConnectedDevices();
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK')
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    return () => {
      stopListener.remove();
    };
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length == 0) {
        console.log('No connected bluetooth devices');
      } else {
        for (let i = 0; i < results.length; i++) {
          let peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setConnected(true);
          setBluetoothDevices(Array.from(peripherals.values()));
        }
      }
    });
  };

  const connectToPeripheral = peripheral => {
    if (peripheral.connected) {
      BleManager.disconnect(peripheral.id).then(() => {
        peripheral.connected = false;
        setConnected(false);
        alert(`Disconnected from ${peripheral.name}`);
      });
    } else {
      BleManager.connect(peripheral.id)
        .then(() => {
          let peripheralResponse = peripherals.get(peripheral.id);
          if (peripheralResponse) {
            peripheralResponse.connected = true;
            peripherals.set(peripheral.id, peripheralResponse);
            setConnected(true);
            setBluetoothDevices(Array.from(peripherals.values()));
          }
          alert('Connected to ' + peripheral.name);
        })
        .catch(error => console.log(error));
      setTimeout(() => {
        BleManager.retrieveServices(peripheral.id).then(peripheralData => {
          console.log('Peripheral services:', peripheralData);
        });
      }, 900);
    }
  };

  // render list of bluetooth devices
  const RenderItem = ({peripheral}) => {
    const color = peripheral.connected ? 'green' : '#fff';
    return (
      <>
        <Text
          style={{
            fontSize: 20,
            marginLeft: 10,
            marginBottom: 5,
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
          Nearby Devices:
        </Text>
        <TouchableOpacity onPress={() => connectToPeripheral(peripheral)}>
          <View
            style={{
              backgroundColor: color,
              borderRadius: 5,
              paddingVertical: 5,
              marginHorizontal: 10,
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                textTransform: 'capitalize',
                color: connected ? Colors.white : Colors.black,
              }}>
              {peripheral.name}
            </Text>
            <View
              style={{
                backgroundColor: color,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: connected ? Colors.white : Colors.black,
                }}>
                RSSI: {peripheral.rssi}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: connected ? Colors.white : Colors.black,
                }}>
                ID: {peripheral.id}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
    
  };

  const getLocationGPS = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };
  const getLocationWIFI = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };


 return (
   <View style={styles.container}>
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View>
          <TouchableOpacity activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={startScan}>
              <Text style={styles.buttonTextStyle}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>
        </View>
        {bluetoothDevices.map(device => (
          <View key={device.id}>
            <RenderItem peripheral={device} />
          </View>
        ))}
      </ScrollView>
     <Text>Welcome!</Text>
     <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location with GPS" onPress={getLocationGPS}/>

        
      </View>
      <View style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location with WIFI" onPress={getLocationWIFI}/>
      </View>
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
   </View>
 );
};



const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
 },
 mainBody: {
  flex: 1,
  justifyContent: 'center',
  height: useWindowDimensions,
},
buttonStyle: {
  backgroundColor: '#307ecc',
  borderWidth: 0,
  color: '#FFFFFF',
  borderColor: '#307ecc',
  height: 40,
  alignItems: 'center',
  borderRadius: 30,
  marginLeft: 35,
  marginRight: 35,
  marginTop: 15,
},
buttonTextStyle: {
  color: '#FFFFFF',
  paddingVertical: 10,
  fontSize: 16,
},
});

export default App;