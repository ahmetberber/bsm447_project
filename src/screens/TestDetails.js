import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../UserProvider';

const TestDetails = ({ route }) => {
    const { type, patientId, dob } = route.params;
    const [value, setValue] = useState('');
    const [tests, setTests] = useState([]);
    const { userRole } = useUser();
    const g = ['ap', 'cilv', 'tjp'];

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
        const calculateAgeInMonths = () => {
            const birthDate = new Date(dob);
            const today = new Date();
            return ((today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth());
        };

        const determineStatus = (val, referenceRanges) => {
            var age = calculateAgeInMonths();
            const range = referenceRanges.find((r) => r.max_age_months !== null ? age >= r.min_age_months && age <= r.max_age_month : age >= r.min_age_months);
            if (!range) { return 'No Reference'; }
            if (val < range.min_val) { return 'Low'; }
            if (val > range.max_val) { return 'High'; }
            return 'Normal';
        };

        const fetchTests = async () => {
            const snapshot = await firestore()
                .collection('tests')
                .where('testType', '==', type)
                .where('patientId', '==', patientId)
                .orderBy('createdAt', 'desc')
                .get();

            var currentTests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const guides = ['ap', 'cilv', 'tjp'];
            const immunoglobulins = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];

            for (const guide of guides) {
                const ss = await firestore().collection('guides').doc(guide).get();
                for (const immunoglobulin of immunoglobulins.filter((ig) => ig === type)) {
                    const refs = ss.data()[immunoglobulin];
                    currentTests = currentTests.map((test) => {
                        test[guide] = test[guide] || {};
                        test[guide].status = determineStatus(test.value, refs);
                        return test;
                    });
                }
            }

            setTests(currentTests);
        };

        fetchTests();
    }, [type, patientId, dob]);

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
                    />
                    <Button mode="contained" onPress={addTest} style={styles.button}>
                        Add Test
                    </Button>
                </>
            ) : null}
            {tests.length > 0 ? (
                <FlatList
                    data={tests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Text style={styles.testValue}>Value: {item.value}</Text>
                                    {g.map((guide) => (
                                        <Text key={guide} style={styles.testValue}>
                                            {guide}: {item[guide]?.status}
                                        </Text>
                                    ))}
                                    <Text style={styles.testValue}>Created At: {item.createdAt?.toDate().toLocaleString()}</Text>
                                </Card.Content>
                            </Card>
                        );
                    }}
                />
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 45, fontSize: 22 }}>
                    No tests available.
                </Text>
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
        padding: 16,
        elevation: 4,
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
        margin: 16,
    },
    testValue: {
        fontSize: 16,
        marginTop: 4,
    },
});

export default TestDetails;
