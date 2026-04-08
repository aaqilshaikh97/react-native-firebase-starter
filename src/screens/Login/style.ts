import { StyleSheet } from 'react-native';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    color: '#000000',

    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  googleBtn: { width: '100%', height: 60 },
});
