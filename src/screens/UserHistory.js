import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Divider, Title } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserHistory = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestHistory = async () => {
      const uid = auth().currentUser.uid;
      try {
        const snapshot = await firestore()
          .collection('tests')
          .where('uid', '==', uid)
          .orderBy('createdAt', 'desc')
          .get();

        setTests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching test history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading test history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.testCard}>
            <Card.Content>
              <Title style={styles.testTitle}>{item.testType}</Title>
              <Divider />
              <Text style={styles.testValue}>Value: {item.value}</Text>
              <Text style={styles.testDate}>
                Date: {item.createdAt?.toDate().toLocaleString() || 'Unknown'}
              </Text>
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
  list: {
    marginTop: 16,
  },
  testCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  testValue: {
    fontSize: 16,
    marginTop: 8,
  },
  testDate: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserHistory;
