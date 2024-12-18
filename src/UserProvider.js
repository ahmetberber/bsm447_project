import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserContext = createContext({
    userId: null,
    userRole: null,
    userEmail: null,
    patientId: null,
    seyUserId: (id) => {},
    setUserRole: (role) => {},
    setUserEmail: (email) => {},
    setPatientId: (id) => {},
});

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        setUserId(currentUser.uid);
        setUserRole(userData ? userData.role : null);
        setUserEmail(currentUser.email);
        setPatientId(userData ? userData.patientId : '');
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userId, userRole, userEmail, patientId, setUserId, setUserRole, setUserEmail, setPatientId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
