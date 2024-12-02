import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
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
      .get();
    setTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addTest = async () => {
    const uid = auth().currentUser.uid;
    await firestore().collection('tests').add({
      uid,
      testType,
      value: parseFloat(value),
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    fetchTests();
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Test Type"
        value={testType}
        onChangeText={setTestType}
      />
      <TextInput
        style={styles.input}
        placeholder="Value"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />
      <Button title="Add Test" onPress={addTest} />
      <FlatList
        data={tests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{`${item.testType}: ${item.value}`}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8 },
});

export default TestScreen;
