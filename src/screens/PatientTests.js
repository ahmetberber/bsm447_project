import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const TestScreen = ({ route, navigation }) => {
  const { patientId } = route.params;
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const snapshot = await firestore()
        .collection('tests')
        .where('patientId', '==', patientId)
        .orderBy('createdAt', 'desc')
        .get();

      const lastTests = {};
      ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].forEach((type) => {
        lastTests[type] = snapshot.docs
          .filter((doc) => doc.data().testType === type)
          .slice(0, 1)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
      });

      setTests(lastTests);
    };

    fetchTests();
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4']}
        keyExtractor={(item) => item}
        renderItem={({ item: type }) => (
          <Card
            key={type}
            style={[styles.testCard]}
            onPress={() => navigation.navigate('TestDetails', { type, patientId: patientId })}
          >
            <Card.Content>
              <Title style={styles.categoryText}>{type}</Title>
              {tests[type] && tests[type].length > 0 ? (
                tests[type].map((test, index) => (
                  <View key={test.id} style={{ marginBottom: index < tests[type].length - 1 ? 10 : 0 }}>
                    <Text style={styles.testValue}>Value: {test.value}</Text>
                    <Text style={styles.testValue}>Created At: {test.createdAt.toDate().toLocaleString()}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.testValue}>No data available</Text>
              )}
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  testCard: {
    backgroundColor: '#9f9dff',
    borderRadius: 8,
    elevation: 2,
    padding: 16,
    margin: 10,
  },
  testValue: {
    fontSize: 16,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default TestScreen;
