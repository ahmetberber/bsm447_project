import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation }) => {
  const logout = async () => {
    await auth().signOut();
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Home</Title>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            Go to Profile
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Tests')}
          >
            Start Tests
          </Button>
          <Button
            mode="outlined"
            style={styles.logoutButton}
            onPress={logout}
          >
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
});

export default HomeScreen;
