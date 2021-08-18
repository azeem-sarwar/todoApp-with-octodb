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
} from 'react-native';
import SQLLite,{openDatabase,enablePromise} from 'react-native-octodb';
import {useForceUpdate} from './CustomHook'
// console.log('opening the db')
import db from '../DatabaseCOnnection/DB'




export default  Items = ({done: doneHeading, onPressItem}) => {
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
        console.log("ok")
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