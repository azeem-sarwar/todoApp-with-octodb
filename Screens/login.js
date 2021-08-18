import React,{useRef} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// import { Input, Button } from "react-native-elements";
import { images } from "../constants";


import { sha256 } from 'react-native-sha256';






import SQLLite from 'react-native-octodb';

// console.log('opening the db')
const db = SQLLite.openDatabase({name: 'file:todo.db?node=secondary&connect=tcp://198.58.100.244:1234',location:'Document'},(e)=>{console.log("Success:"+e)},(e)=>{console.log("Filure:"+e)});



// maybe the code below should be inside the 'success' cb from openDatabase
// or in the App()




const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };
  return [htmlElRef, setFocus];
};


const Login = ({navigation}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [emailRef,setEmailRef] = useFocus()

  const [passwordRef,setPasswordRef] =useFocus()
  
  const [db_is_ready,setDbIsReady] = React.useState()
  




React.useEffect(()=>{
 
  db.on('ready', () => {
    setDbIsReady(false)
    navigation.replace("MainScreen")
   
  });
  
},[])
  const get_login_info=async()=>{
    var passwd = await sha256( email+ password +"")
    var info = {email:email,passwd:passwd}
    return JSON.stringify(info)
  }

  const Login_Click_Handler= async() =>{
    setDbIsReady(true)
    var info = await get_login_info();
    var sql = "pragma user_login='" + info + "'"
    db.executeSql(sql, [], (results) => {
      console.log('log in command sent'+JSON.parse(results))
      // print_status()
    }, (msg) => {
      setDbIsReady(false)
      console.log('could not log in the user:', msg)
    });  
  }

  const Sign_Up_Click_Handler= async() =>{
    setDbIsReady(true)
    var info = await get_login_info();
    var sql = "pragma user_signup='" + info + "'"
    db.executeSql(sql, [], (results) => {
      console.log('log in command sent'+JSON.parse(results))
      // print_status()

    }, (msg) => {
      setDbIsReady(false)
      console.log('could not log in the user:', msg)
    });
  }
if(db_is_ready)
{
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator color="blue" size="large" />
    </View>
  )
}
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          paddingTop: 40,
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/login.png")}
          resizeMode="contain"
          style={{
            height: "90%",
            width: "90%",
          }}
        />
      </View>

      <View
        style={{
          flex: 2,
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#636262",
            padding: 20,
            marginBottom: 10,
          }}
        >
          Login to your account
        </Text>
        <View
          style={{
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.searchSection}>
            <Icon name="mail" size={18} style={{marginHorizontal:5}} color="#cacaca" />
            <TextInput
            ref={emailRef}
              style={styles.input}
              keyboardType='email-address'
              maxLength={30}
              onSubmitEditing={()=>setPasswordRef()}
              placeholder="Email"
              returnKeyType="next"
              autoCapitalize="none"
              onChangeText={(text)=>{
                  setEmail(text.toLowerCase())
              }}
            />
          </View>
          <View style={styles.searchSection}>
          <Icon name="lock-closed" style={{marginHorizontal:5}} size={18} color="#cacaca" />
          <TextInput 
          ref={passwordRef}
            style={styles.input}
            maxLength={20}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text)=>{
                setPassword(text)
            }}
          />
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            width: "90%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#8462f5",
              padding: 15,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
            onPress={()=>{Login_Click_Handler()}}
          >
            <Text style={{ color: "#ffffff", fontSize: 20 }}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#8462f5",
              padding: 15,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={()=>{
              Sign_Up_Click_Handler()
              // print_status()
              // Sign_Up_Click_Handler()
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 20 }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight,
  },
  searchSection: {
    
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderColor: "#ddd",
    borderWidth: 1,

    borderRadius: 5,
    fontSize: 14,

    marginVertical: 5,
    
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    fontSize: 14,
  },
});
export default Login;
