import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.viewProfile} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={23} color="gray" />
        <Text style={styles.username}>{title}</Text>
    </TouchableOpacity>
);

export default function Privacy() {
    const navigation = useNavigation();

    const sections = [
        {
            title: 'Me',
            items: [
                { icon: 'calendar-outline', title: 'Birthday', screen: 'PhoneNumberScreen' },
                { icon: 'account-circle-outline', title: 'Show online status', screen: 'EmailScreen' },
            ],
        },
        {
            title: 'Messages and calls',
            items: [
                { icon: 'account-eye-outline', title: 'Show "Seen" status', screen: 'SecurityCheckupScreen' },
                { icon: 'message-text-outline', title: 'Allow messaging', screen: 'LockZaloScreen' },
                { icon: 'phone', title: 'Allow calling', screen: 'LockZaloScreen' },
            ],
        },
    ];

    return (
        <ScrollView>
            <View style={styles.container}>
                {sections.map((section, index) => (
                    <View key={index} style={styles.accountWrapper}>
                        <Text style={styles.title}>{section.title}</Text>
                        {section.items.map((item, idx) => (
                            <MenuItem
                                key={idx}
                                icon={item.icon}
                                title={item.title}
                                onPress={() => navigation.navigate(item.screen)}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: '#224785',
        fontWeight: 'bold',
        fontSize: 15,
        paddingVertical: 10,
    },
    viewProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    username: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
    accountWrapper: {
        backgroundColor: '#fff',
        marginBottom: 5,
        paddingHorizontal: 15,
    },
});
