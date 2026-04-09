import React, { useEffect } from 'react';
import { View, Text, TextInput, Alert, Button } from 'react-native';
import { Formik } from 'formik';
import { LoginValidation } from './validation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { loginStyle } from './style';
import { LoginUrl, WebClientID } from '../../const/url';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

const Login = () => {
  const navigation = useNavigation<any>();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        values.email,
        values.password,
      );
      console.log('data', userCredential);

      const user = userCredential.user;

      console.log('Firebase Login Success:', user);

      // Store token (optional)
      const token = await user.getIdToken();
      await AsyncStorage.setItem('userToken', token);

      const name = user.displayName || user.email || '';
      await AsyncStorage.setItem('userName', name);

      navigation.replace('Home');
    } catch (error: any) {
      console.log('Firebase Login Error:', error);

      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'User not found');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Invalid password');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleSignup = async (values: { email: string; password: string }) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );

      const user = userCredential.user;

      console.log('Signup Success:', user);

      const token = await user.getIdToken();
      await AsyncStorage.setItem('userToken', token);

      navigation.replace('Home');
    } catch (error: any) {
      console.log('Signup Error:', error);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already exists');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password should be at least 6 characters');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };
  // const handleLogin = async (values: { email: string; password: string }) => {
  //   console.log('email', values.email);
  //   console.log('password', values.password);
  //   console.log('baseURL', LoginUrl);

  //   try {
  //     const response = await axios.post(LoginUrl, {
  //       username: values.email,
  //       password: values.password,
  //     });

  //     console.log('Login Success:', response.data);
  //     const token = response.data.data.access;
  //     const firstName = response.data.data.account?.first_name || '';
  //     const lastName = response.data.data.account?.last_name || '';

  //     const name = `${firstName} ${lastName}`.trim();
  //     await AsyncStorage.setItem('userToken', token);
  //     await AsyncStorage.setItem('userName', name);
  //     navigation.replace('Home');
  //   } catch (error: any) {
  //     console.error('Login Error:', error);
  //     console.log('FULL ERROR:', error.response?.data);

  //     Alert.alert('Error', 'Something went wrong');
  //   }
  // };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WebClientID,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo:', userInfo);

      // Step 2: Get tokens (THIS IS THE FIX ✅)
      const { idToken } = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('userToken', idToken);
      const userName = (userInfo as any)?.data?.user?.name || '';
      await AsyncStorage.setItem('userName', userName);
      console.log('idToken:', idToken);
      console.log('userName:', userName);

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
      navigation.replace('Home');
    } catch (error) {
      console.log('Google Sign-In Error', error);
    }
  };

  //

  return (
    <View style={loginStyle.container}>
      <Text style={loginStyle.title}>Login</Text>
      <Text style={loginStyle.subtitle}>Faimsoft Academy</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginValidation}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#000000"
              style={loginStyle.input}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={loginStyle.error}>{errors.email}</Text>
            )}

            {/* Password */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#000000"
              style={loginStyle.input}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {touched.password && errors.password && (
              <Text style={loginStyle.error}>{errors.password}</Text>
            )}

            {/* Button */}
            <View style={loginStyle.submitContainer}>
              <Button onPress={handleSubmit as any} title="Login" />
              <Button
                title="Signup"
                onPress={() =>
                  handleSignup({
                    email: values.email,
                    password: values.password,
                  })
                }
              />
            </View>
          </>
        )}
      </Formik>

      <View style={loginStyle.googleBtn}>
        <GoogleSigninButton
          style={loginStyle.googleBtn}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signInWithGoogle}
        />
      </View>
    </View>
  );
};

export default Login;
