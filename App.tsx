import 'react-native-gesture-handler';
import React from 'react';
import MyStack from './src/route';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

export default App;
