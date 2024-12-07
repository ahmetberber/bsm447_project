
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const AdminPanel = () => {
  const [guides, setGuides] = useState([]);
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
    const snapshot = await firestore().collection('guides').get();
    setGuides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
    setMessage(`Error fetching guides: ${error.message}`);
    } finally {
    setLoading(false);
    }
};

  const addGuide = async () => {
    if (!newGuideTitle) {
      Alert.alert('Validation Error', 'Please enter a title for the guide.');
      return;
    }
    try {
      await firestore().collection('guides').add({
        title: newGuideTitle,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setNewGuideTitle('');
      setMessage('Guide added successfully!');
      fetchGuides();
    } catch (error) {
      setMessage(`Error adding guide: ${error.message}`);
    }
  };

  const deleteGuide = async (guideId) => {
    Alert.alert(
      'Delete Guide',
      'Are you sure you want to delete this guide?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firestore().collection('guides').doc(guideId).delete();
              setMessage('Guide deleted successfully!');
              fetchGuides();
            } catch (error) {
              setMessage(`Error deleting guide: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  if (loading) {
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
          <Title style={styles.title}>Add New Guide</Title>
          <TextInput
            label="Guide Title"
            value={newGuideTitle}
            onChangeText={setNewGuideTitle}
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={addGuide} style={styles.button}>
            Add Guide
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.guideCard}>
            <Card.Content>
              <Text style={styles.guideTitle}>{item.title}</Text>
              <Divider />
              <Button mode="text" onPress={() => deleteGuide(item.id)}>
                Delete Guide
              </Button>
            </Card.Content>
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
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
  },
  list: {
    marginTop: 16,
  },
  guideCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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

export default AdminPanel;
