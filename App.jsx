import React, { Component } from "react";
import { 
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View, 
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from './components/Home';
import Chat from "./components/Websockets";
import 'react-native-gesture-handler';

const RootStack = createStackNavigator(
  {
    Home: {
      screen:Home
    },
    Chat: {
      screen:Chat
    }
  },
  {
    index: 0,
    headerMode:'none',
    initialRouteName: 'Home'
  }
)
const AppContainer = createAppContainer(RootStack);

class App extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      return <AppContainer />
    }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    padding: 16,
  },
});