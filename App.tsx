import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import PatientTests from './src/screens/PatientTests';
import auth from '@react-native-firebase/auth';
import Patients from './src/screens/Patients';
import AddPatient from './src/screens/AddPatient';
import PatientTestGraph from './src/screens/PatientTestGraph';
import EditPatient from './src/screens/EditPatient';
import TestDetails from './src/screens/TestDetails';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async currentUser => {
      if (currentUser) {
        setUserExist(true);
      }

      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userExist ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Patients" component={Patients} />
            <Stack.Screen name="AddPatient" component={AddPatient} />
            <Stack.Screen name="EditPatient" component={EditPatient} />
            <Stack.Screen name="PatientTests" component={PatientTests}/>
            <Stack.Screen name="TestDetails" component={TestDetails}/>
            <Stack.Screen name="PatientTestGraph" component={PatientTestGraph}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }}/>
          </>
        )
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
