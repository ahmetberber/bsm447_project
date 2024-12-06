import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Card, Title, Text, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import firestore, { collection, query, where } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
};

const categorizeTestValue = (testType, value) => {
  const range = referenceRanges[testType];
  if (!range) {return 'Unknown';}
  if (value < range[0]) {return 'Düşük';}
  if (value > range[1]) {return 'Yüksek';}
  return 'Normal';
};

const TestScreen = () => {
  const [testType, setTestType] = useState('');
  const [value, setValue] = useState('');
  const [tests, setTests] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const uid = auth().currentUser.uid;
    const subscriber = firestore().collection('users').doc(uid).onSnapshot((doc) => {
      setUserRole(doc.data().role);
    });
    return subscriber;
  }, []);

  const fetchTests = async (filter = '') => {
    const uid = auth().currentUser.uid;
    let q = query(collection(firestore(), 'tests'), where('uid', '==', uid));
    if (filter) {
      q = query(q, where('testType', '==', filter));
    }
    const snapshot = await q.get();
    setTests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  const getBackgroundColor = (category) => {
    switch (category) {
      case 'Düşük':
        return '#ADD8E6';
      case 'Yüksek':
        return '#FFB6C1';
      case 'Normal':
        return '#90EE90';
      default:
        return '#D3D3D3';
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <View style={styles.container}>
        {userRole === 'admin' ? (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>Add a Test</Title>
                <Picker selectedValue={testType} onValueChange={(itemValue) => setTestType(itemValue)} style={styles.input}>
                  <Picker.Item label="IgA" value="IgA" />
                  <Picker.Item label="IgM" value="IgM" />
                  <Picker.Item label="IgG" value="IgG" />
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
          </>
        ) : (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>Filter Tests</Title>
                <Text>Select Test Type</Text>
                <Picker selectedValue={filterType} onValueChange={(itemValue) => setFilterType(itemValue)} style={styles.input}>
                  <Picker.Item label="All" value="" />
                  <Picker.Item label="IgA" value="IgA" />
                  <Picker.Item label="IgM" value="IgM" />
                  <Picker.Item label="IgG" value="IgG" />
                </Picker>
                <Button mode="contained" onPress={() => fetchTests(filterType)} style={styles.button}>
                  Apply Filter
                </Button>
              </Card.Content>
            </Card>
          </>
        ) }
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const category = categorizeTestValue(
            item.testType,
            item.value,
          );
          const backgroundColor = getBackgroundColor(category);

          return (
            <Card style={[styles.testCard, { backgroundColor }]}>
              <Card.Content>
                <Text style={styles.testText}>{item.testType}</Text>
                <Divider />
                <Text style={styles.testValue}>Value: {item.value}</Text>
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
});

export default TestScreen;
