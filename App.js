import React,{useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import Login from './Screens/login'
import MainScreen from './Screens/MainScreen'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import db from './DatabaseCOnnection/DB'





function print_status() {
  db.executeSql("pragma sync_status", [], (results) => {
    if (results.rows && results.rows.length > 0) {
      var status = JSON.parse(status.sync_status).db_is_ready;
      console.log('sync status rootscreen:', JSON.parse(status.sync_status).db_is_ready);
      //status = JSON.parse(status.sync_status);
      alert()
    } else {
      console.log('OctoDB is not active')
    }
  }, (msg) => {
    console.log('could not run "pragma sync_status":', msg)
  });
}
// maybe the code below should be inside the 'success' cb from openDatabase
// or in the App()

db.on('error', (err) => {
  print_status()
  // console.log('error:', err)
});

db.on('not_ready', () => {
  // show the signup/login screen
  //showUserLogin();
  console.log('event: the db is not yet ready\n-------------')

  print_status()

  // var info = {email: 'k1@email.me', passwd: '123'}
  // //var sql = "pragma user_signup='" + JSON.stringify(info) + "'"
  // var sql = "pragma user_login='" + JSON.stringify(info) + "'"

  // // console.log(sql)

  // db.executeSql(sql, [], (results) => {
  //   console.log('log in command sent')
  // }, (msg) => {
  //   console.log('could not log in the user:', msg)
  // });

});

db.on('ready', () => {
  // login successful, show the main screen
  //showMainScreen();
  console.log('event: the db is ready!\n-------------')
  print_status()
});

db.on('sync', () => {
  console.log('the db received an update!\n-------------')
  //show_items();
});





export default function App({navigation}) {
const Stack = createNativeStackNavigator()
const [db_is_ready,setDbIsReady] = React.useState()
useEffect(()=>{



},[])


  return (
    <SafeAreaView style={styles.container}>
     <NavigationContainer>
       <Stack.Navigator screenOptions={{headerShown:false}}>
         <Stack.Screen name="MainScreen" component={MainScreen} />
         <Stack.Screen name="Login" component={Login} />  
       </Stack.Navigator>
     </NavigationContainer>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAED',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  listArea: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
    color: 'black',
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});
