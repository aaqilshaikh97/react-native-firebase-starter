import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

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
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage?.notification?.title || 'No Title';
      const body = remoteMessage?.notification?.body || 'No Body';
      Alert.alert(title, body);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '749233143031-qo1f7rhfhrrs3t31cubj1r1bq3udvsl9.apps.googleusercontent.com', // 🔥 from Firebase
    });
  }, []);

  // const [user, setUser] = useState();

  // Handle user state changes
  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), user => {
      console.log('Auth User:', user); // 👈 debug

      handleAuthStateChanged(user);
    });

    return subscriber;
  }, []);
  if (initializing) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // Step 1: Sign in
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo:', userInfo);

      // Step 2: Get tokens (THIS IS THE FIX ✅)
      const { idToken } = await GoogleSignin.getTokens();

      console.log('idToken:', idToken);

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Step 3: Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Step 4: Sign in to Firebase
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      console.log('Logged in user:', userCredential.user);
    } catch (error) {
      console.log('Google Sign-In Error', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 22, marginBottom: 20 }}>Login Screen</Text>

        <Text
          style={{
            backgroundColor: '#4285F4',
            color: 'white',
            padding: 12,
            borderRadius: 8,
          }}
          onPress={signInWithGoogle}
        >
          Sign in with Google
        </Text>
      </View>
    );
  }

  const logout = async () => {
    try {
      await auth().signOut(); // Firebase logout
      await GoogleSignin.signOut(); // Google logout
      console.log('User logged out');
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

  return (
    // <View style={styles.container}>
    //   <Text>Welcome {user?.email}</Text>
    //   <Text
    //     onPress={logout}
    //     style={styles.btn}
    //   >
    //     Logout
    //   </Text>
    // </View>
       <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 40,
  },
  btn:{
          marginTop: 20,
          backgroundColor: 'red',
          color: 'white',
          padding: 12,
          borderRadius: 8,
        }
});

export default App;
