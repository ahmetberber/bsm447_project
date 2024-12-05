import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import TestScreen from './src/screens/TestScreen';
import auth from '@react-native-firebase/auth';
import UsersScreen from './src/screens/Users';

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
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home Page' }}
            />
            <Stack.Screen
              name="Users"
              component={UsersScreen}
              options={{ title: 'Users' }}
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
          <>
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          </>
        )
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
