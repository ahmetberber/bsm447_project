import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AddPatient = ({ navigation }) => {
    const [adSoyad, setAdSoyad] = useState('');
    const [dogumTarihi, setDogumTarihi] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cinsiyet, setCinsiyet] = useState('');
    const [dogumYeri, setDogumYeri] = useState('');
    const [hastaNumarasi, setHastaNumarasi] = useState('');

    const handleAddPatient = () => {
        if (!adSoyad || !dogumTarihi || !cinsiyet || !dogumYeri || !hastaNumarasi) {
            Alert.alert('Validation Error', 'Please fill out all fields.');
            return;
        }

        firestore().collection('patients').add({
            adSoyad,
            dogumTarihi: dogumTarihi.toISOString().split('T')[0],
            cinsiyet,
            dogumYeri,
            hastaNumarasi,
        });

        setAdSoyad('');
        setDogumTarihi(new Date());
        setCinsiyet('');
        setDogumYeri('');
        setHastaNumarasi('');

        Alert.alert('Success', 'Patient added successfully!', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('Patients'),
            },
        ]);
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dogumTarihi;
        setShowDatePicker(Platform.OS === 'ios');
        setDogumTarihi(currentDate);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <TextInput
                        label="Ad Soyad"
                        value={adSoyad}
                        onChangeText={setAdSoyad}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Doğum Tarihi"
                        value={formatDate(dogumTarihi)}
                        onFocus={showDatePickerModal}
                        style={styles.input}
                        mode="outlined"
                    />
                    {showDatePicker && (
                        <DateTimePicker
                            value={dogumTarihi}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                    <View style={styles.input}>
                        <Picker
                            selectedValue={cinsiyet}
                            onValueChange={(itemValue) => setCinsiyet(itemValue)}
                            mode="dropdown"
                        >
                            <Picker.Item label="Cinsiyet Seçin" value="" />
                            <Picker.Item label="Erkek" value="Erkek" />
                            <Picker.Item label="Kız" value="Kız" />
                        </Picker>
                    </View>
                    <TextInput
                        label="Doğum Yeri"
                        value={dogumYeri}
                        onChangeText={setDogumYeri}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Hasta Numarası"
                        value={hastaNumarasi}
                        onChangeText={setHastaNumarasi}
                        style={styles.input}
                        mode="outlined"
                    />
                    <Button mode="contained" onPress={handleAddPatient} style={styles.button}>
                        Submit
                    </Button>
                </Card.Content>
            </Card>
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
});

export default AddPatient;
