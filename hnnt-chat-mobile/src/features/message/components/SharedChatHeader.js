import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SharedChatHeader({ navigation, chatName, chatId, onBack, actions }) {
    return (
        <LinearGradient
            colors={['#0087FD', '#00ACF4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
        >
            <View style={styles.leftContainer}>
                <TouchableOpacity onPress={onBack || (() => navigation.goBack())}>
                    <Feather name="arrow-left" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.chatName}>{chatName}</Text>
            </View>
            <View style={styles.rightContainer}>
                {actions.map((action, index) => (
                    <TouchableOpacity key={index} onPress={action.onPress}>
                        <Feather name={action.icon} size={22} color="#fff" />
                    </TouchableOpacity>
                ))}
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
    chatName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 100,
    },
});
