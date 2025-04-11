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

export default function AccountAndSecurity() {
    const navigation = useNavigation();

    const sections = [
        {
            title: 'Account',
            items: [
                { icon: 'phone-outline', title: 'Phone number', screen: 'Change phone number' },
                { icon: 'email-outline', title: 'Email', screen: 'Add your email' },
            ],
        },
        {
            title: 'Security',
            items: [
                { icon: 'lock-check-outline', title: 'Security checkup', screen: 'Managed logged-in devices' },
                { icon: 'cellphone-lock', title: 'Lock Zalo', screen: 'Managed logged-in devices' },
            ],
        },
        {
            title: 'Login',
            items: [
                { icon: 'cellphone', title: 'Logged-in devices', screen: 'Managed logged-in devices' },
                { icon: 'lock-outline', title: 'Password', screen: 'Change password' },
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
