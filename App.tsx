import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import TestScreen from './src/screens/TestScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async currentUser => {
      if (currentUser) {
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        setUserRole(userData ? userData.role : null);
      } else {
        setUserRole(null);
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
        {userRole === 'admin' ? (
          <>
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : userRole === 'user' ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Stack.Screen
              name="Tests"
              component={TestScreen}
              options={{ title: 'Tests' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        )
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
