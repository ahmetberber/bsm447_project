import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation }) => {
    const logout = async () => {
        await auth().signOut();
    };

    return (
        <View style={styles.container}>
        <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
        <Button title="Tests" onPress={() => navigation.navigate('Tests')} />
        <Button title="Logout" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;
