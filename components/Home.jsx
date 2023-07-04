import React, { useState, useEffect } from 'react';
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
  Platform,
  PermissionsAndroid
} from 'react-native';
import notifee, { 
  AndroidStyle, 
  IntervalTrigger, 
  TimestampTrigger,
  TimeUnit, 
  TriggerType 
} from '@notifee/react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import RNCalendarEvents from "react-native-calendar-events";
import { removeEvent } from "react-native-calendar-events";
import Geolocation from "react-native-geolocation-service";



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


const EVENT_TITLE = 'Lunch';
const TIME_NOW_IN_UTC = moment.utc();

const createTwoButtonAlert = (alertMessage) =>
    Alert.alert('Alert Title', alertMessage, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC)
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return s;
};




const showCalendarEventWithId = (eventId) => {
  if (!eventId) {
    createTwoButtonAlert('Please Insert Event Id');
    return;
  }
  const eventConfig = {
    eventId,
    allowsEditing: true,
    allowsCalendarPreview: true,
    navigationBarIOS: {
      tintColor: 'orange',
      backgroundColor: 'green',
    },
  };

  AddCalendarEvent.presentEventViewingDialog(eventConfig)
    .then((eventInfo) => {
      createTwoButtonAlert('eventInfo -> ' + JSON.stringify(eventInfo));
    })
    .catch((error) => {
      createTwoButtonAlert('Error -> ' + error);
    });
};




const Home = ({navigation}) => {
  const [task, setTask] = useState('');
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = React.useState([]);
  const [location, setLocation] = useState(false);
  
  async function motivationTrigger_1_Notification() {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'mq1notification',
      name: 'mq1',
    });

    // Create an interval trigger
    const trigger = {
      type: TriggerType.INTERVAL,
      interval: 15,
      timeUnit: TimeUnit.MINUTES
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Motivation',
        body: 'You can do it!',
        android: {
          channelId,
          timestamp: Date.now() + 900000, // add 15 minutes to display correct time
          showTimestamp: true,
        },
      },
      trigger,
    );
    let newDate = Date();
    console.log("First motivational quote trigger created at "+ newDate);
  }
  async function motivationTrigger_2_Notification() {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'mq2notification',
      name: 'mq2',
    });

    // Create an interval trigger
    const trigger  = {
      type: TriggerType.INTERVAL,
      interval: 20,
      timeUnit: TimeUnit.MINUTES
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Motivation',
        body: 'Not all angels have wings, some have scrubs.',
        android: {
          channelId,
          timestamp: Date.now() + 1200000, // add 20 minutes to display correct time
          showTimestamp: true,
        },
      },
      trigger,
    );
    let newDate = Date();
    console.log("Second motivational quote trigger created at "+ newDate);
  }

  async function motivationTrigger_3_Notification() {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'mq3notification',
      name: 'mq3',
    });

    // Create an interval trigger
    const trigger  = {
      type: TriggerType.INTERVAL,
      interval: 30,
      timeUnit: TimeUnit.MINUTES
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Motivation',
        body: 'You treat a disease: you win, you lose. You treat a person, I guarantee you win—no matter the outcome.',
        android: {
          channelId,
          timestamp: Date.now() + 1500000, // add 30 minutes to display correct time
          showTimestamp: true,
        },
      },
      trigger,
    );
    let newDate = Date();
    console.log("Third motivational quote trigger created at "+ newDate);
  }

  async function exerciseTrigger_1_Notification() {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'ex1notification',
      name: 'ex1',
    });

    // Create an interval trigger
    const trigger  = {
      type: TriggerType.INTERVAL,
      interval: 15,
      timeUnit: TimeUnit.MINUTES
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Exercise Time!',
        body: 'Do some squats!',
        android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          style: { type: AndroidStyle.BIGPICTURE, picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGYhWDl211NJysgVKAib5JQiGw5eI9bWugERf1yqtspeGXFEvR6ZfxowUoCJrqA3N3fNw&usqp=CAU' },
          timestamp: Date.now() + 900000, // add 15 minutes to display correct time
          showTimestamp: true,
        },
      },
      trigger,
    );
    let newDate = Date();
    console.log("First exercise quote trigger created at "+ newDate);
  }

  async function exerciseTrigger_2_Notification() {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'ex2notification',
      name: 'ex2',
    });

    // Create an interval trigger
    const trigger  = {
      type: TriggerType.INTERVAL,
      interval: 20,
      timeUnit: TimeUnit.MINUTES
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Exercise Time!',
        body: 'Stretch!',
        android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          style: { type: AndroidStyle.BIGPICTURE, picture: 'https://www.wikihow.com/images/thumb/a/a0/Stretch-Your-Arms-Step-6.jpg/v4-460px-Stretch-Your-Arms-Step-6.jpg.webp' },
          timestamp: Date.now() + 1200000, // add 20 minutes to display correct time
          showTimestamp: true,
        },
      },
      trigger,
    );
    let newDate = Date();
    console.log("Second exercise quote trigger created at "+ newDate);
  }

  async function exerciseTrigger_3_Notification() {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'ex3notification',
      name: 'ex3',
    });

    // Create an interval trigger
    const trigger  = {
      type: TriggerType.INTERVAL,
      interval: 30,
      timeUnit: TimeUnit.MINUTES
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Exercise Time!',
        body: 'Do some lunges!',
        android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          style: { type: AndroidStyle.BIGPICTURE, picture: 'https://blog.myfitnesspal.com/wp-content/uploads/2020/07/UACF-Lunges-Featured.jpg' },
          timestamp: Date.now() + 1500000, // add 30 minutes to display correct time
          showTimestamp: true,
        },
      },
      trigger,
    );
    let newDate = Date();
    console.log("Third exercise quote trigger created at "+ newDate);
  }
  
  

  

  

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

  useEffect(() => {
    listEvents();
    getLocationGPS();
    getLocationWIFI();
    motivationTrigger_1_Notification();
    motivationTrigger_2_Notification();
    motivationTrigger_3_Notification();
    exerciseTrigger_1_Notification();
    exerciseTrigger_2_Notification();
    exerciseTrigger_3_Notification();
  }, []);

  const listEvents = async () => {
    const allevents = await RNCalendarEvents.fetchAllEvents(
      '1970-01-01T00:00:00.000Z',
      '2200-01-01T00:00:00.000Z'
    );

    const eventList = allevents.map((item) => ({
      id: item.id,
      title: item.title,
    time: moment(item.startDate).format('YYYY-MM-DD, h:mm A'),
    
    }));

    setEvents(eventList);
  };

  const editCalendarEventWithId = (eventId) => {
    if (!eventId) {
      createTwoButtonAlert('Please Insert Event Id');
      return;
    }
    const eventConfig = {
      eventId,
    };
  
    AddCalendarEvent.presentEventEditingDialog(eventConfig)
      .then((eventInfo) => {
        //createTwoButtonAlert('eventInfo -> ' + JSON.stringify(eventInfo));
        listEvents();
      })
      .catch((error) => {
        createTwoButtonAlert('Error -> ' + error);
      });
  };
  
const addToCalendar = (title, startDateUTC) => {
    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: 
      utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
      notes: 'tasty!',
      navigationBarIOS: {
        tintColor: 'orange',
        backgroundColor: 'green',
        titleColor: 'blue',
      },
    };
  
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        //createTwoButtonAlert('eventInfo -> ' + JSON.stringify(eventInfo));
        listEvents(); 
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        createTwoButtonAlert('Error -> ' + error);
      });
  
  };

  const deleteCalendarEventWithId = (eventId) => {
    if (!eventId) {
      createTwoButtonAlert('Please Insert Event Id');
      return;
    }
  
    RNCalendarEvents.removeEvent(eventId)
      .then(() => {
        listEvents();
      })
      .catch((error) => {
        createTwoButtonAlert('Error -> ' + error);
      });

      
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>
          Add Task to Nurse Log
        </Text>
        <Text style={styles.heading}>
          Date Time: {
            moment.utc(TIME_NOW_IN_UTC).local().format('lll')
          }
        </Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="enter task title"
          onChangeText={(task) => setTask(task)}
          value={task}
        />
        <TouchableOpacity
          style={[styles.buttonStyle, {minWidth: '100%'}]}
          onPress={() => {
            addToCalendar(task, TIME_NOW_IN_UTC);
          }}>
          <Text style={styles.buttonTextStyle}>
            Add Event to Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => 
                navigation.navigate('Chat')}>
                  <Text>Chat Room</Text>
                </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>    
          <SafeAreaView>
              <FlatList
                data={events}
                renderItem={({ item }) =>
                <View style={{flexDirection: 'row'}}>
                    <View style={{margin: 10, width: 250}}><Button color="#00bbf0" title={item.title + '\n' + item.time}
                    onPress={() => editCalendarEventWithId(item.id)}
                    />
                    </View>
                    <View style={{paddingTop: 20}}>
                        <Button color="#f44336" title='Delete' onPress={() => deleteCalendarEventWithId(item.id)} />
                    </View>
                </View>}
                />
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    padding: 16,
  },
  heading: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#f5821f',
    margin: 15,
  },
  buttonTextStyle: {
    color: 'white',
    textAlign: 'center',
  },
  buttonHalfStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    flex: 1,
  },
  titleStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  inputStyle: {
    height: 40,
    minWidth: '100%',
    marginBottom: 10,
    marginTop: 30,
    padding: 10,
    backgroundColor: '#ffe6e6',
  },
});
