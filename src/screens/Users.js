import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Button, Text, Title } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await firestore().collection('users').get();
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const promoteToAdmin = async (user) => {
    try {
      await firestore().collection('users').doc(user.id).update({ role: 'admin' });
      setMessage(`${user.email} has been promoted to admin.`);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === user.id ? { ...u, role: 'admin' } : u))
      );
    } catch (error) {
      setMessage('An error occurred while promoting the user.');
    }
  };

  const demoteToUser = async (user) => {
    try {
      await firestore().collection('users').doc(user.id).update({ role: 'user' });
      setMessage(`${user.email} has been demoted to user.`);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === user.id ? { ...u, role: 'user' } : u))
      );
    } catch (error) {
      setMessage('An error occurred while demoting the user.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>{item.email}</Title>
              <Text style={styles.text}>Role: {item.role}</Text>
            </Card.Content>
            <Card.Actions>
              {item.role === 'admin' ? (
                <Button
                  mode="contained"
                  onPress={() => demoteToUser(item)}
                  style={styles.button}
                >
                  Demote to User
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => promoteToAdmin(item)}
                  style={styles.button}
                >
                  Promote to Admin
                </Button>
              )}
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
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

export default UsersScreen;
