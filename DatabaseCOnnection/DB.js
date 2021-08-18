
import SQLLite from 'react-native-octodb';

// console.log('opening the db')
const db = SQLLite.openDatabase({name: 'file:todo.db?node=secondary&connect=tcp://198.58.100.244:1234',location:'Document'},(e)=>{console.log("Success:"+e)},(e)=>{console.log("Filure:"+e)});




export default db;