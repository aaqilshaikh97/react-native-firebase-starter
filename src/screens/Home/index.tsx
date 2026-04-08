import React, { useEffect, useState } from 'react';
import {
  Text,
  View, PermissionsAndroid,
  Alert,Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { HomeStyle } from './style';
const Home = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState<string>('');

  const getUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setName(storedName);
      }
    } catch (error) {
      console.log('Error getting name:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('Result', result);
      console.log('Result', PermissionsAndroid.RESULTS.GRANTED);

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
        requestToken();
      } else {
        Alert.alert('permission denied');
      }
    } catch (error) {
      console.log('error ', error);
    }
  };

  const requestToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('Token', token);
    } catch (error) {
      console.log('Token Error', error);
    }
  };

  useEffect(() => {
    requestPermission();
    getUserData();
  }, []);

  return (
    <View style={HomeStyle.container}>
      <Text style={HomeStyle.text}>Welcome, {name}</Text>

         <Button onPress={() => navigation.replace('Profile')} title="Go To Profile" />
    </View>
  );
};

export default Home;


