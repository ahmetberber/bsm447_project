import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Card, Title, Text, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const TestScreen = () => {
  const [testType, setTestType] = useState('');
  const [value, setValue] = useState('');
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    const uid = auth().currentUser.uid;
    const snapshot = await firestore()
      .collection('tests')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    setTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addTest = async () => {
    if (!testType || !value) {
      return;
    }

    const uid = auth().currentUser.uid;
    await firestore().collection('tests').add({
      uid,
      testType,
      value: parseFloat(value),
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    setTestType('');
    setValue('');
    fetchTests();
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add a Test</Title>
          <TextInput
            label="Test Type"
            mode="outlined"
            value={testType}
            onChangeText={setTestType}
            style={styles.input}
            placeholder="Enter test type"
          />
          <TextInput
            label="Value"
            mode="outlined"
            value={value}
            onChangeText={setValue}
            style={styles.input}
            placeholder="Enter value"
            keyboardType="numeric"
          />
          <Button mode="contained" onPress={addTest} style={styles.button}>
            Add Test
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={tests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.testCard}>
            <Card.Content>
              <Text style={styles.testText}>{item.testType}</Text>
              <Divider />
              <Text style={styles.testValue}>Value: {item.value}</Text>
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
  testCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  testText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  testValue: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default TestScreen;
