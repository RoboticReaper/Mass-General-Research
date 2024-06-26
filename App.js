import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors'
import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


let time = 0;
let allData = [];
let unsub = null;
let paused = true;

export default function App() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 })
  const [activity, setActivity] = useState("walk")
  let interval = 10

  function reportData() {
    if (allData.length === 0) {
      return;
      // don't log empty data
    }
    const now = new Date();
    const docName = now.toString();
    setDoc(doc(db, "data", docName), {
      activity,
      acceleration: allData,
    }).then(() => {
      Alert.alert("Logged data to firebase.")
    }).catch((err) => {
      console.log(err)
    })
  }

  function stop() {
    unsub.remove();
    paused = true;
  }

  function start() {
    if (!paused) {
      return;
    }
    paused = false;
    Accelerometer.setUpdateInterval(interval)
    unsub = Accelerometer.addListener((data) => {
      setData(data);
      data['time'] = time
      allData.push(data);
      time += interval;
    })
  }


  return (
    <View style={styles.container}>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <View style={styles.horizontal}>
        <View style={styles.btn}><Button onPress={() => { setActivity("walk") }} title="Walk" /></View>
        <View style={styles.btn}><Button onPress={() => { setActivity("run") }} title="Run" /></View>
        <View style={styles.btn}><Button onPress={() => { setActivity("jump") }} title="Jump" /></View>
        <View style={styles.btn}><Button onPress={() => { setActivity("downstair") }} title="Down stair" /></View>
        <View style={styles.btn}><Button onPress={() => { setActivity("upstair") }} title="Up stair" /></View>
      </View>
      <Text>Current activity: {activity}</Text>
      <Button onPress={() => { reportData() }} title="Report data" />
      <Text>Recording data for {time}ms</Text>
      <Button onPress={() => { time = 0; allData = []; setData({ x: 0, y: 0, z: 0 }) }} title="Clear data" />

      <Text>Measurement interval: {interval}ms</Text>
      <View style={styles.btn}><Button onPress={() => { start() }} title="Start recording" /></View>
      <View style={styles.btnBig}><Button style={styles.btnBig} onPress={() => { stop() }} title="Stop recording" /></View>
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
  horizontal: {
    margin: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: "center"
  },
  btn: {
    marginHorizontal: 5,
  },
  btnBig: {
    margin: 5,
    width: 150,
    backgroundColor: "blue"
  },

});
