import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { ProfileStyle } from './style';

const Profile = () => {
  const navigation = useNavigation<any>();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');

      await auth()
        .signOut()
        .catch(() => {});

      await GoogleSignin.signOut().catch(() => {});

      console.log('User logged out');

      navigation.replace('Login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <View style={ProfileStyle.container}>
      <Text style={ProfileStyle.title}>Profile Screen</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Profile;
