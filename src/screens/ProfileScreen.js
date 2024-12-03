import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title, Text, ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
    }
    setLoading(false);
  }, []);

  const updateProfile = async () => {
    try {
      await user.updateProfile({ displayName });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Profile</Title>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{user.email}</Text>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              mode="outlined"
              value={displayName}
              onChangeText={setDisplayName}
              style={styles.input}
              placeholder="Enter your name"
            />
            <Button
              mode="contained"
              onPress={updateProfile}
              style={styles.button}
            >
              Update Profile
            </Button>
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </Card.Content>
        </Card>
      ) : (
        <Text style={styles.info}>User not found.</Text>
      )}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: 'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
