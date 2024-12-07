import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Button, Text, Title, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await firestore().collection('users').get();
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    Alert.alert(
      'Update Role',
      `Are you sure you want to update the role to "${newRole}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await firestore().collection('users').doc(userId).update({ role: newRole });
              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === userId ? { ...user, role: newRole } : user
                )
              );
              Alert.alert('Success', 'User role updated successfully!');
            } catch (error) {
              console.error('Error updating role:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>{item.email}</Title>
              <Divider />
              <Text style={styles.text}>Current Role: {item.role}</Text>
              <Button
                mode="contained"
                onPress={() => updateRole(item.id, item.role === 'admin' ? 'user' : 'admin')}
                style={styles.button}
              >
                {item.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
              </Button>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
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
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    padding: 16,
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
  list: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoleManagement;
