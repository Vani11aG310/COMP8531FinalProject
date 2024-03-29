import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';


export default function Chat() {
  const [serverState, setServerState] = React.useState('Loading...');
  const [messageText, setMessageText] = React.useState('');
  const [disableButton, setDisableButton] = React.useState(true);
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true);
  const [serverMessages, setServerMessages] = React.useState([]);
  var ws = React.useRef(new WebSocket('ws://10.0.2.2:443/')).current;


  React.useEffect(() => {
    const serverMessagesList = [];
    ws.onopen = () => {
      setServerState('Connected to the server')
      setDisableButton(false);
    };
    ws.onclose = (e) => {
      setServerState('Disconnected. Check internet or server.')
      setDisableButton(true);
    };
    ws.onerror = (e) => {
      setServerState(e.message);
    };
    ws.onmessage = (e) => {
      console.log(e);
      serverMessagesList.push(e.data);
      setServerMessages([...serverMessagesList])
    };
  }, [])
  const submitMessage = () => {
    ws.send(messageText);
    setMessageText('')
    setInputFieldEmpty(true)
  }
  return (
    <View style={styles.container}>
      <View style={{
        height: 30,
        backgroundColor: '#FA8072',
        padding: 5
        }}>
        <Text>{serverState}</Text>
      </View>
      <View style={{
        backgroundColor: '#ADD8E6',
        padding: 5,
        flexGrow: 1
        }}>
        <ScrollView>
          {
            serverMessages.map((item, ind) => {
              return (
                <Text key={ind}>{item}</Text>
              )
            })
          }
        </ScrollView>
      </View>
      <View style={{
        flexDirection: 'row',
        }}>
        <TextInput 
          style={{
            borderWidth: 1,
            borderColor: 'black',
            flexGrow: 1,
            padding: 5,
            }} 
          placeholder={'Add Message'} 
          onChangeText={text => {
            setMessageText(text)
            setInputFieldEmpty(text.length > 0 ? false : true)  
            }}
          value={messageText}
         />
        <Button
         onPress={submitMessage}
         title={'Submit'} 
         disabled={disableButton || inputFieldEmpty}
        />
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 30,
    padding: 8,
  },

});