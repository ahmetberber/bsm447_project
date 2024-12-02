import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
    }
  }, []);

  const updateProfile = async () => {
    try {
      await user.updateProfile({ displayName });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Email: {user.email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <Button title="Update Profile" onPress={updateProfile} />
          {message ? <Text>{message}</Text> : null}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8 },
});

export default ProfileScreen;
