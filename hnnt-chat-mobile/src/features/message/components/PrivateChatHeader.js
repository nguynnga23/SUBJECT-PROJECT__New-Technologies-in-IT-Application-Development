import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Modern and thin icons
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivateChatHeader({ navigation, recipientName }) {
    return (
        <LinearGradient
            colors={['#0087FD', '#00ACF4']} // xanh dương đậm -> xanh dương nhạt
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} // chiều ngang
            style={styles.header}
        >
            <View style={styles.leftContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.recipientName}>{recipientName}</Text>
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('PrivateVoiceCallScreen')}>
                    <Feather name="phone" size={21} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PrivateCallScreen')}>
                    <Feather name="video" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('PrivateChatInfoScreen', { recipientName })}>
                    <Feather name="info" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recipientName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 100, // Adjusted width to fit the new button
    },
});
