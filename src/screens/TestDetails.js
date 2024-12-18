import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../UserProvider';

const TestDetails = ({ route }) => {
    const { type, patientId } = route.params;
    const [value, setValue] = useState('');
    const [tests, setTests] = useState([]);
    const { userRole } = useUser();

    const addTest = async () => {
        if (!value) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }

        const newTest = {
            patientId,
            testType: type,
            value: parseFloat(value),
            createdAt: firestore.Timestamp.now(),
        };

        Alert.alert('Success', 'Test added successfully!');
        const docRef = await firestore().collection('tests').add(newTest);
        setTests([{ id: docRef.id, ...newTest }, ...tests]);
        setValue('');
    };

    useEffect(() => {
        const fetchTests = async () => {
            const snapshot = await firestore()
                .collection('tests')
                .where('testType', '==', type)
                .where('patientId', '==', patientId)
                .orderBy('createdAt', 'desc')
                .get();
            setTests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };

        fetchTests();
    }, [type, patientId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{type} Tests</Text>
            {userRole === 'admin' ? (
                <>
                    <TextInput
                        label="Value"
                        value={value}
                        onChangeText={setValue}
                        style={styles.input}
                        keyboardType="numeric"
                        mode="outlined"
                        theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
                    />
                    <Button mode="contained" onPress={addTest} style={styles.button} color="#6200ee">
                        Add Test
                    </Button>
                </>
            ) : null }
            {tests.length > 0 ? (
                <FlatList style={{ marginTop: 16 }}
                    data={tests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.testValue}>Value: {item.value}</Text>
                                <Text style={styles.testValue}>Created At: {item.createdAt ? item.createdAt.toDate().toLocaleString() : 'N/A'}</Text>
                            </Card.Content>
                        </Card>
                    )}
                />
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 45, fontSize: 22 }}>No tests available.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#9f9dff',
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
    testValue: {
        fontSize: 16,
        marginTop: 4,
    },
});

export default TestDetails;
