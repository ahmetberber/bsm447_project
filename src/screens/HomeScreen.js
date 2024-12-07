import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Title, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async currentUser => {
      if (currentUser) {
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        setUserRole(userData ? userData.role : null);
        setUserEmail(currentUser.email);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await auth().signOut();
            navigation.replace('Auth');
          },
        },
      ]
    );
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome</Title>
          <Text style={styles.subtitle}>{userEmail}</Text>
          {userRole === 'admin' ? (
            <>
              <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('AdminPanel')}>
                Admin Panel
              </Button>
              <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('RoleManagement')}>
                Manage Roles
              </Button>
            </>
          ) : null}
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Profile')}>
            View Profile
          </Button>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Tests')}>
            Test Results
          </Button>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('TestGraph')}>
            Test Graph
          </Button>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('UserHistory')}>
            Test History
          </Button>
          <Button mode="outlined" style={styles.logoutButton} onPress={logout}>
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 400,
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
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 16,
    borderRadius: 8,
    borderColor: '#ff0000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
