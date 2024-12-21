import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const updatePassword = async () => {
    try {
      await user.updatePassword(password);
      setMessage('Password updated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
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
      {user ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{user.email}</Text>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              mode="outlined"
              value={user.password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={updatePassword}
              style={styles.button}
            >
              Update Password
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
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

export default ProfileScreen;
