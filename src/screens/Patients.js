import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, Card, Title, Text, Divider, ActivityIndicator } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const Patients = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const snapshot = await firestore().collection('patients').get();
      setPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      Alert.alert('Error', `Error fetching patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (patientId) => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firestore().collection('patients').doc(patientId).delete();
              fetchPatients();
            } catch (error) {
              Alert.alert('Error', `Error deleting patient: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate('AddPatient')} style={styles.button}>
        Add Patient
      </Button>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.patientCard}>
            <Card.Content>
              <Title style={styles.patientTitle}>{item.adSoyad}</Title>
              <Text style={styles.patientInfo}>Doğum Tarihi: {new Date(item.dogumTarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
              <Text style={styles.patientInfo}>Cinsiyet: {item.cinsiyet}</Text>
              <Text style={styles.patientInfo}>Doğum Yeri: {item.dogumYeri}</Text>
              <Text style={styles.patientInfo}>Hasta Numarası: {item.hastaNumarasi}</Text>
              <Divider style={styles.divider} />
              <Button mode="contained" onPress={() => navigation.navigate('PatientTests', { patientId: item.id })} style={styles.button}>
                View Tests
              </Button>
              {/* <Button mode="contained" onPress={() => navigation.navigate('PatientTestGraph', { patientId: item.id })} style={styles.button}>
                View Test Graph
              </Button> */}
              <Button mode="contained" onPress={() => navigation.navigate('EditPatient', { patientId: item.id })} style={styles.button}>
                Edit Patient
              </Button>
              <Button mode="contained" onPress={() => deletePatient(item.id)} style={styles.button}>
                Delete Patient
              </Button>
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
  patientCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  patientTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  patientInfo: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666666',
  },
  divider: {
    marginVertical: 8,
  },
  list: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666666',
  },
  button: {
    marginTop: 8,
  },
});

export default Patients;
