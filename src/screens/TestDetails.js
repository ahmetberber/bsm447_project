import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../UserProvider';

const TestDetails = ({ route }) => {
    const { patientId, dob } = route.params;
    const [type, setType] = useState(null);
    const [filterType, setFilterType] = useState(null);
    const [value, setValue] = useState('');
    const [tests, setTests] = useState([]);
    const { userRole } = useUser();
    const g = ['ap', 'cilv', 'tjp'];
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 2)));
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
        await firestore().collection('tests').add(newTest);
        setModalVisible(false);
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
            setLoading(true);
            let query = firestore()
                .collection('tests')
                .where('patientId', '==', patientId)
                .orderBy('createdAt', 'desc');

            if (filterType) {
                query = query.where('testType', '==', filterType);
            }

            if (startDate && endDate) {
                query = query.where('createdAt', '>=', firestore.Timestamp.fromDate(startDate))
                             .where('createdAt', '<=', firestore.Timestamp.fromDate(endDate));
            }

            const snapshot = await query.get();
            var currentTests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const guides = ['ap', 'cilv', 'tjp'];
            const immunoglobulins = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];

            for (const guide of guides) {
                const ss = await firestore().collection('guides').doc(guide).get();
                currentTests = currentTests.map((test) => {
                    if(immunoglobulins.includes(test.testType) && ss.data()[test.testType]) {
                        test[guide] = test[guide] || {};
                        test[guide].status = determineStatus(test.value, ss.data()[test.testType]);
                    }
                    return test;
                });
            }

            setLoading(false);
            setTests(currentTests);
        };

        fetchTests();
    }, [filterType, startDate, endDate, patientId, dob]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" style={styles.loading} />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>Patient Tests</Text>
                {userRole === 'admin' && (
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.openButton}>
                        <Text style={styles.openButtonText}>Add New Test</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Add New Test</Text>
                        <View style={{ width: '100%', marginBottom: 16 }}>
                            <Picker
                                selectedValue={type}
                                onValueChange={(itemValue) => setType(itemValue)}
                                style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}
                            >
                                <Picker.Item label="Select Type" value="" />
                                <Picker.Item label="IgA" value="IgA" />
                                <Picker.Item label="IgM" value="IgM" />
                                <Picker.Item label="IgG" value="IgG" />
                                <Picker.Item label="IgG1" value="IgG1" />
                                <Picker.Item label="IgG2" value="IgG2" />
                                <Picker.Item label="IgG3" value="IgG3" />
                                <Picker.Item label="IgG4" value="IgG4" />
                            </Picker>
                        </View>
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
                        <Button mode="text" onPress={() => setModalVisible(false)} style={styles.button}>
                            Cancel
                        </Button>
                    </View>
                </View>
            </Modal>
            <View style={styles.filterContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>Start Date: {startDate.toLocaleDateString('tr-TR')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>End Date: {endDate.toLocaleDateString('tr-TR')}</Text>
                    </TouchableOpacity>
                </View>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        dateFormat="day month year"
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartDatePicker(false);
                            if (selectedDate) {
                                setStartDate(selectedDate);
                            }
                        }}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        dateFormat="day month year"
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndDatePicker(false);
                            if (selectedDate) {
                                setEndDate(selectedDate);
                            }
                        }}
                    />
                )}
                <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16 }}>
                    <Picker
                        selectedValue={filterType}
                        onValueChange={(itemValue) => setFilterType(itemValue)}
                        style={{ width: '100%' }}
                    >
                        <Picker.Item label="All Types" value={null} />
                        <Picker.Item label="IgA" value="IgA" />
                        <Picker.Item label="IgM" value="IgM" />
                        <Picker.Item label="IgG" value="IgG" />
                        <Picker.Item label="IgG1" value="IgG1" />
                        <Picker.Item label="IgG2" value="IgG2" />
                        <Picker.Item label="IgG3" value="IgG3" />
                        <Picker.Item label="IgG4" value="IgG4" />
                    </Picker>
                </View>
            </View>
            {tests.length > 0 ? (
                <FlatList
                    data={tests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Text style={styles.testValue}>Type: {item.testType}</Text>
                                    <Text style={styles.testValue}>Value: {item.value}</Text>
                                    {g.map((guide) => (
                                        <Text key={guide} style={styles.testValue}>
                                            {guide}: {item[guide]?.status}
                                        </Text>
                                    ))}
                                    <Text style={styles.testValue}>Created At: {item.createdAt?.toDate().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
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
    },
    input: {
        marginBottom: 16,
        width: '100%',
    },
    button: {
        marginTop: 8,
        width: '100%',
        borderRadius: 8,
    },
    testValue: {
        fontSize: 16,
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        marginBottom: 16,
    },
    openButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    openButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        width: '90%',
        maxHeight: '80%', // Modalın ekran boyutunu aşmasını önler
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-start', // İçeriği üstten başlatır
    },
    filterContainer: {
        marginBottom: 16,
    },
    dateButton: {
        backgroundColor: '#256aa3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    dateButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default TestDetails;
