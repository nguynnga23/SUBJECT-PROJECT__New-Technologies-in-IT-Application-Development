import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as Contacts from 'expo-contacts';
import friendService from '../../../services/FriendService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
);

const PhonebookScreen = () => {
    const [selectedTab, setSelectedTab] = useState('all');
    const [isUpdated, setIsUpdated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdateTime, setLastUpdateTime] = useState('12/04/2025 20:17');
    const [dynamicContacts, setDynamicContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const contacts = await getContacts();
            if (contacts) {
                const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
                if (token) {
                    try {
                        const response = await friendService.syncContacts(
                            contacts.map((c) => c.number),
                            token,
                        );
                        setDynamicContacts(
                            response.matchedUsers.map((user) => {
                                const phoneContact = contacts.find(
                                    (c) => c.number?.replace(/\s+/g, '') === user.number?.replace(/\s+/g, ''),
                                );
                                return {
                                    id: user.id,
                                    name: phoneContact?.name || user.name, // Use phone contact name if available, fallback to user's name
                                    zalo: user.name,
                                    avt: user.avatar,
                                    status: user.isFriend ? 'Already Friend' : 'Add', // Check if the user is already a friend
                                };
                            }),
                        );
                    } catch (error) {
                        console.error('Error syncing contacts:', error);
                    }
                }
            }
        };
        fetchContacts();
    }, []);

    const handleReload = () => {
        setIsUpdated(false); // Reset the updated status
        // Simulate reload logic
        setTimeout(() => {
            const currentDateTime = new Date();
            const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;
            setLastUpdateTime(formattedDateTime); // Update the last update time
            setIsUpdated(true); // Set updated status after reload
            alert('Phonebook synchronized successfully!');
        }, 2000); // Simulate a delay for the reload
    };

    const filteredContacts = dynamicContacts
        .filter((contact) => selectedTab === 'all' || contact.status === 'Add')
        .filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const renderItem = ({ item }) => (
        <View style={styles.contactItem}>
            <View style={styles.avatar}>
                <Image source={{ uri: item.avt }} style={styles.modalAvatar} />
            </View>

            <View style={styles.contactInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.zalo}>Zalo name: {item.zalo}</Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    item.status === 'Already Friend' && { backgroundColor: '#E0E0E0' }, // Gray out the button for friends
                ]}
                disabled={item.status === 'Already Friend'} // Disable button if already a friend
            >
                <Text
                    style={[
                        styles.actionButtonText,
                        item.status === 'Already Friend' && { color: '#999' }, // Change text color for friends
                    ]}
                >
                    {item.status}
                </Text>
            </TouchableOpacity>
        </View>
    );
    const getContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
            });

            if (data.length > 0) {
                // Ensure phone numbers are properly formatted and associated with names
                const phoneNumbers = data
                    .map((contact) => ({
                        number: contact.phoneNumbers?.[0]?.number?.replace(/\s+/g, ''), // Remove spaces for consistency
                        name: contact.name,
                    }))
                    .filter((contact) => contact.number); // Filter out contacts without phone numbers
                return phoneNumbers;
            }
        } else {
            console.warn('Permission denied for accessing contacts.');
        }
        return [];
    };

    return (
        <View style={styles.container}>
            {/* Update Info */}
            <View style={styles.updateInfo}>
                <View style={styles.updateTextContainer}>
                    <Text style={styles.updateText}>Last phonebook update</Text>
                    <Text style={styles.updateTime}>{lastUpdateTime}</Text>
                    {isUpdated && <Text style={styles.successText}>✔ Updated successfully</Text>}
                </View>
                <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
                    <Feather name="refresh-cw" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                placeholderTextColor="#999" // đổi sang màu bạn muốn
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TabButton
                    title={`All (${dynamicContacts.length})`}
                    isActive={selectedTab === 'all'}
                    onPress={() => setSelectedTab('all')}
                />
                <TabButton
                    title={`Not friends (${dynamicContacts.filter((contact) => contact.status === 'Add').length})`}
                    isActive={selectedTab === 'notFriends'}
                    onPress={() => setSelectedTab('notFriends')}
                />
            </View>

            {/* Contact List */}
            <FlatList
                data={filteredContacts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionText}>B</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
    header: { backgroundColor: '#2196F3', padding: 15, alignItems: 'center' },
    headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    updateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
    },
    updateTextContainer: {
        flex: 1,
    },
    updateText: {
        color: '#666',
        fontSize: 14,
    },
    updateTime: {
        fontWeight: 'bold',
        marginVertical: 5,
        fontSize: 14,
    },
    successText: {
        color: 'green',
        fontSize: 14,
    },

    reloadButton: {
        backgroundColor: '#E5F0FF',
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff', // Set background color to white
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomColor: '#DEE3E7',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        backgroundColor: '#fff', // Set background color to white
    },
    activeTab: {
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 16,
        color: '#6D6D6D',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    sectionHeader: { padding: 10, backgroundColor: '#F5F5F5' },
    sectionText: { fontSize: 16, fontWeight: 'bold' },
    contactItem: { flexDirection: 'row', padding: 10, alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 40, backgroundColor: '#ccc' },
    modalAvatar: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginBottom: 15,
    },
    contactInfo: { flex: 1, marginLeft: 10 },
    name: { fontSize: 16, fontWeight: 'bold' },
    zalo: { color: '#666' },
    actionButton: {
        backgroundColor: '#E5F0FF',
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100, // Ensure consistent width
    },
    actionButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
        borderColor: '#DEE3E7',
        borderWidth: 1,
    },
});

export default PhonebookScreen;
