import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';

const PatientTestGraph = ({ route }) => {
  const { patientId } = route.params;
  const [tests, setTests] = useState([]);
  const [testType, setTestType] = useState(['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4']);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const snapshot = await firestore()
          .collection('tests')
          .where('patientId', '==', patientId)
          .orderBy('createdAt', 'asc')
          .get();
        setTests(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [patientId]);

  useEffect(() => {
    if (testType) {
      const data = tests.filter((test) => test.testType === testType).map((test) => ({
        x: new Date(test.createdAt.toDate()).toLocaleDateString('en-GB').replace(/\//g, '.'),
        y: test.value,
      }));

      setFilteredData(data);
    }
  }, [testType, tests]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Test Type</Text>
      <Picker selectedValue={testType} onValueChange={(itemValue) => setTestType(itemValue)} style={styles.picker}>
        <Picker.Item label="Select Test Type" value="" />
        <Picker.Item label="IgA" value="IgA" />
        <Picker.Item label="IgM" value="IgM" />
        <Picker.Item label="IgG" value="IgG" />
        <Picker.Item label="IgG1" value="IgG1" />
        <Picker.Item label="IgG2" value="IgG2" />
      </Picker>
      {filteredData.length > 0 ? (
          <VictoryChart>
            <VictoryAxis dependentAxis label="Value" />
            <VictoryAxis label="Date"/>
            <VictoryLine data={filteredData}/>
          </VictoryChart>
        ) : (
          <Text style={styles.noDataText}>No data available for the selected test type.</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default PatientTestGraph;
