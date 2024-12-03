import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, Title } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Home'); // Login sonrası yönlendirme
    } catch (error) {
      setMessage(error.message);
    }
  };

  const register = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email: user.email,
        role: 'user',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setMessage('User registered successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={login}
            style={styles.button}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={register}
            style={styles.button}
          >
            Register
          </Button>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: 'red',
  },
});

export default AuthScreen;
