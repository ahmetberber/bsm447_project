import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import auth from '@react-native-firebase/auth';
import Patients from './src/screens/Patients';
import AddPatient from './src/screens/AddPatient';
import EditPatient from './src/screens/EditPatient';
import TestDetails from './src/screens/TestDetails';
import { UserProvider } from './src/UserProvider';
import { ActivityIndicator } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async currentUser => {
      if (currentUser) {
        setUserExist(true);
      }

      if (loading) {
        setLoading(false);
      }
    });
    return subscriber;
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" style={styles.loading} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator initialRouteName={userExist ? 'Home' : 'Auth'}>
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Patients" component={Patients} />
            <Stack.Screen name="AddPatient" component={AddPatient} />
            <Stack.Screen name="EditPatient" component={EditPatient} />
            <Stack.Screen name="TestDetails" component={TestDetails}/>
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginBottom: 16,
  },
});

export default App;
