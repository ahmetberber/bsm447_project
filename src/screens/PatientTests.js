import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const TestScreen = ({ route, navigation }) => {
  const { patientId } = route.params;
  const immunoglobulins = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];

  return (
    <View style={styles.container}>
      <FlatList
        data={immunoglobulins}
        keyExtractor={(item) => item}
        renderItem={({ item: type }) => (
          <Card
            key={type}
            style={[styles.testCard]}
            onPress={() => navigation.navigate('TestDetails', { type, patientId: patientId, dob: route.params.dob })}
          >
            <Card.Content>
              <Title style={styles.categoryText}>{type}</Title>
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
    padding: 8,
    margin: 8,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default TestScreen;
