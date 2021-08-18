import { useFocusEffect } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';


import db from '../DatabaseCOnnection/DB'

var dbStatus

function print_status() {

  db.executeSql("pragma sync_status", [], (results) => {
    if (results.rows && results.rows.length > 0) {
      
      status = JSON.parse(status.sync_status)
      console.log('sync status MainScreen:', JSON.parse(status.sync_status).db_is_ready);
      //status = JSON.parse(status.sync_status);
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
  // print_status()
  console.log('error:', err)
});





db.on('sync', () => {
  console.log('the db received an update!\n-------------')
  print_status()
  //show_items();
});







const Items = ({done: doneHeading, onPressItem}) => {
  const [items, setItems] = React.useState(null);

  useEffect(() => {
    db.executeSql(
      //"select id, name, done from tasks where done = cast(? as integer)",
      "select id, name, done from tasks where done = ?",
      [doneHeading ? 1 : 0],
      (results) => {
        var len = results.rows.length;
        console.log(doneHeading ? 'done len:' : 'undone len:', len)
        if (len > 0) {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          console.log(doneHeading ? 'done items:' : 'undone items:', temp)
          setItems(temp);
        }
      },
      (error) => {
        console.log('error retrieving items:', error)
      }
    );
  }, []);

  const heading = doneHeading ? 'Completed' : 'Todo' || '';
  if (items === null || items?.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>

      {items?.map(({id, name, done}) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id)}
          style={
            done ? [styles.item, {backgroundColor: '#1c9963'}] : styles.item
          }>
          <View style={styles.itemLeft}>
            <View style={styles.square}></View>
            <Text
              style={
                done ? [styles.itemText, {color: 'white'}] : styles.itemText
              }>
              {name}
            </Text>
          </View>
          <View style={styles.circular}></View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function MainScreen({navigation}) {
  const [text, setText] = useState(null);
  const [DBSTATUS, SETDBSTATUS] = useState("");
  
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const add = text => {
    console.log('adding new item: ' + text)
    if (text === null || text === '') {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO tasks (name, done) values (?, 0)', [text]);
      },
      null,
      forceUpdate,
    )

  

  };
 
 React.useEffect(()=>{
 let stata
  db.on('not_ready', () => {
   
    console.log('event: the db is not yet ready it is here\n-------------')
    navigation.replace("Login")
   
  
  });
   
 },[])

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled">
              <View style={styles.tasksWrapper}>
                <Text style={styles.sectionTitle}>Today's tasks</Text>
                <View style={styles.items}>
                  <Items
                    key={`forceupdate-todo-${forceUpdateId}`}
                    done={false}
                    onPressItem={id =>
                      db.transaction(
                        tx => {
                          tx.executeSql(
                            "update tasks set done = 1 where id = ?",
                            [id],
                          );
                        },
                        null,
                        forceUpdate,
                      )
                    }
                  />
                  <Items
                    done
                    key={`forceupdate-done-${forceUpdateId}`}
                    onPressItem={id =>
                      db.transaction(
                        tx => {
                          tx.executeSql("delete from tasks where id = ?", [id]);
                        },
                        null,
                        forceUpdate,
                      )
                    }
                  />
                </View>
              </View>
            </ScrollView>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.writeTaskWrapper}>
              <TextInput
                style={styles.input}
                placeholder={'Write a task'}
                placeholderTextColor={'gray'}
                value={text}
                onChangeText={text => setText(text)}
              />
              <TouchableOpacity
                onPress={() => {
                  setText('');
                  add(text);
                  print_status()
                }}>
                <View style={styles.addWrapper}>
                  <Text style={styles.addText}>+</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
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
