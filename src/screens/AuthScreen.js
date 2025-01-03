import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, Title, ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useUser } from '../UserProvider';
import firestore from '@react-native-firebase/firestore';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUserId, setUserRole, setUserEmail, setPatientId } = useUser();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      if(!email || !password) {
        setLoading(false);
        setMessage('Email and password are required');
        return;
      }

      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const currentUser = userCredential.user;
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data();
      setUserId(currentUser.uid);
      setUserRole(userData ? userData.role : null);
      setUserEmail(currentUser.email);
      setPatientId(userData ? userData.patientId : '');

      navigation.replace('Home');
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" style={styles.loading} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Hello</Title>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginBottom: 16,
  },
});

export default AuthScreen;
