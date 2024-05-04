import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';
import { useState, useEffect } from 'react';
import {Accelerometer} from 'expo-sensors'
import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


let time = 0;
let allData = {};

export default function App() {
  const [{x,y,z}, setData] = useState({x:0,y:0,z:0})
  const [magnitude, setMagnitude] = useState(0);

  useEffect(()=>{
    Accelerometer.setUpdateInterval(100)
    Accelerometer.addListener((data)=>{
      setData(data);
      allData[time] = data;
      time+=100;
    })
  },[])

  useEffect(()=>{
    setMagnitude(Math.sqrt(x*x+y*y+z*z))
  }, [x,y,z])

  function reportData(){
    const now = new Date();
    const docName = now.toString();
    setDoc(doc(db, "data", docName), allData).then(()=>{
      console.log("Reported in firebase")
    }).catch((err)=>{
      console.log(err)
    })
  }


  return (
    <View style={styles.container}>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <Text>Magnitude: {magnitude}</Text>
      <Button onPress={()=>{reportData()}} title="Report data" />
      <Text>Recording data for {time/1000} s</Text>
      <Button onPress={()=>{time = 0; allData = {}}} title="Clear data" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'top',
  },
});
