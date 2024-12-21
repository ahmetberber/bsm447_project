import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserContext = createContext({
    userId: null,
    dob: null,
    userRole: null,
    userEmail: null,
    patientId: null,
    setUserId: (id) => {},
    setDob: (dob) => {},
    setUserRole: (role) => {},
    setUserEmail: (email) => {},
    setPatientId: (id) => {},
});

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [dob, setDob] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
        setUserEmail(currentUser.email);

        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        if(userData) {
          setUserRole(userData.role);
          setPatientId(userData.patientId);

          const patientDoc = await firestore().collection('patients').doc(userData.patientId).get();
          const patientData = patientDoc.data();
          if(patientData) {
            setDob(patientData.dogumTarihi);
          }

        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userId, dob, userRole, userEmail, patientId, setUserId, setDob, setUserRole, setUserEmail, setPatientId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
