import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  MainDrawer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MyStack() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      setInitialRoute('Home');
    } else {
      setInitialRoute('Login');
    }

    setLoading(false);
  };

  // Optional: show nothing or loader while checking
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={Login} />
      {/* <Stack.Screen name="MainDrawer" component={MyDrawer} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

export default MyStack;
