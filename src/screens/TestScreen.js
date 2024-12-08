import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const referenceRanges = {
  IgA: {
    '0-1 ay': [6.7, 8.7],
    '1-3 ay': [8.6, 24.6],
    '4-6 ay': [14.7, 53.0],
    '7-12 ay': [21.1, 114],
    '13-24 ay': [31.3, 103],
    '25-36 ay': [46.1, 135],
    '3-5 yıl': [56.3, 192],
    '6-8 yıl': [88.4, 276],
    '9-11 yıl': [94.7, 262],
    '12-16 yıl': [99.3, 305],
    '16-18 yıl': [168.3, 385],
    '18+ yıl': [70, 312],
  },
  IgM: {
    '0-1 ay': [5.1, 50.9],
    '1-3 ay': [15.2, 68.5],
    '4-6 ay': [26.9, 130],
    '7-12 ay': [24.2, 162],
    '13-24 ay': [38.6, 195],
    '25-36 ay': [42.7, 236],
    '3-5 yıl': [58.7, 198],
    '6-8 yıl': [50.3, 242],
    '9-11 yıl': [37.4, 213],
    '12-16 yıl': [42.4, 197],
    '16-18 yıl': [60.7, 323],
    '18+ yıl': [56, 352],
  },
  IgG: {
    '0-1 ay': [399, 1480],
    '1-3 ay': [217, 981],
    '4-6 ay': [270, 1110],
    '7-12 ay': [242, 977],
    '13-24 ay': [389, 1260],
    '25-36 ay': [486, 1970],
    '3-5 yıl': [457, 1120],
    '6-8 yıl': [483, 1580],
    '9-11 yıl': [642, 2290],
    '12-16 yıl': [636, 1610],
    '16-18 yıl': [688, 2430],
    '18+ yıl': [639, 1544],
  },
  IgG1: {
    '2-3 yıl': [486, 1970],
    '4-6 yıl': [457, 1120],
    '7-10 yıl': [483, 1580],
    '11-16 yıl': [642, 2290],
    '17-18 yıl': [636, 1610],
    '18+ yıl': [688, 2430],
  },
  IgG2: {
    '2-3 yıl': [242, 977],
    '4-6 yıl': [389, 1260],
    '7-10 yıl': [486, 1970],
    '11-16 yıl': [457, 1120],
    '17-18 yıl': [483, 1580],
    '18+ yıl': [642, 2290],
  },
};

const categorizeTestValue = (testType, value, ageGroup) => {
  const range = referenceRanges[testType]?.[ageGroup];
  if (!range) {
    return { category: 'Unknown', color: '#D3D3D3', icon: 'help-outline' };
  }
  if (value < range[0]) {
    return { category: 'Düşük', color: '#FFB6C1', icon: 'arrow-downward' };
  }
  if (value > range[1]) {
    return { category: 'Yüksek', color: '#ADD8E6', icon: 'arrow-upward' };
  }
  return { category: 'Normal', color: '#90EE90', icon: 'check-circle' };
};


const TestScreen = () => {
  const [testType, setTestType] = useState('');
  const [value, setValue] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const uid = auth().currentUser.uid;
    const snapshot = await firestore()
      .collection('tests')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    setTests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addTest = async () => {
    if (!testType || !value || !ageGroup) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }
    const uid = auth().currentUser.uid;
    await firestore().collection('tests').add({
      uid,
      testType,
      value: parseFloat(value),
      ageGroup,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    setTestType('');
    setValue('');
    setAgeGroup('');
    fetchTests();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setTests(tests);
    } else {
      const filtered = tests.filter((test) =>
        test.testType.toLowerCase().includes(query.toLowerCase()) ||
        test.value.toString().includes(query.toLowerCase())
      );
      setTests(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add a Test</Title>
          <Picker selectedValue={testType} onValueChange={(itemValue) => setTestType(itemValue)} style={styles.input}>
            <Picker.Item label="Select Test Type" value="" />
            <Picker.Item label="IgA" value="IgA" />
            <Picker.Item label="IgM" value="IgM" />
            <Picker.Item label="IgG" value="IgG" />
            <Picker.Item label="IgG1" value="IgG1" />
            <Picker.Item label="IgG2" value="IgG2" />
          </Picker>
          <Picker selectedValue={ageGroup} onValueChange={(itemValue) => setAgeGroup(itemValue)} style={styles.input}>
            <Picker.Item label="Select Age Group" value="" />
            <Picker.Item label="0-1 ay" value="0-1 ay" />
            <Picker.Item label="1-3 ay" value="1-3 ay" />
            <Picker.Item label="4-6 ay" value="4-6 ay" />
            <Picker.Item label="2-3 yıl" value="2-3 yıl" />
            <Picker.Item label="4-6 yıl" value="4-6 yıl" />
          </Picker>
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
      <TextInput style={styles.searchInput} placeholder="Search test results..." value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { category, color, icon } = categorizeTestValue(item.testType, item.value, item.ageGroup);
          return (
            <Card style={[styles.testCard, { backgroundColor: color }]}>
              <Card.Content>
                <View style={styles.resultContainer}>
                  <Text style={styles.testText}>{item.testType}</Text>
                  <Icon name={icon} size={30} color="#000" />
                </View>
                <Divider />
                <Text style={styles.testValue}>Value: {item.value}</Text>
                <Text style={styles.testValue}>Age Group: {item.ageGroup}</Text>
                  <Text style={styles.categoryText}>Category: {category}</Text>
              </Card.Content>
            </Card>
          );
        }}
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
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
    padding: 16,
  },
  testText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TestScreen;
