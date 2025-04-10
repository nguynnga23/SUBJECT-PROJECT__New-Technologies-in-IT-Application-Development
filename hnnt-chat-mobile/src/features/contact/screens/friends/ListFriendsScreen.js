import { View, Text, StyleSheet, TouchableOpacity, SectionList, Image, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import FriendService from '../../services/FriendService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample data for the friends list
// const allFriends = [
//     { id: '1', name: 'Nguyễn Lê Nhật Huy', avatar: 'https://i.pravatar.cc/150?img=20' },
//     { id: '2', name: 'Nguyễn Thị Nga', avatar: 'https://i.pravatar.cc/150?img=10' },
//     { id: '3', name: 'Nguyễn Thiên Tứ', avatar: 'https://i.pravatar.cc/150?img=14' },
//     { id: '4', name: 'Thanh Nhiệt', avatar: 'https://i.pravatar.cc/150?img=12' },
//     { id: '5', name: 'Anh Long', avatar: 'https://i.pravatar.cc/150?img=17' },
// ];

const recentlyOnlineFriends = [
    { id: '1', name: 'Nguyễn Lê Nhật Huy', group: 'Close Friends', avatar: 'https://i.pravatar.cc/150?img=13' },
    { id: '2', name: 'Nguyễn Thị Nga', avatar: 'https://i.pravatar.cc/150?img=10' },
];

// Function to group friends by the first letter of their name
const groupFriendsByLetter = (friends) => {
    // Sort friends alphabetically by name
    const sortedFriends = [...friends].sort((a, b) => a.name.localeCompare(b.name));

    // Group by first letter
    const grouped = sortedFriends.reduce((acc, friend) => {
        const firstLetter = friend.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(friend);
        return acc;
    }, {});

    // Convert to SectionList format
    return Object.keys(grouped).map((letter) => ({
        title: letter,
        data: grouped[letter],
    }));
};

const ActionItem = ({ title, onPress, iconName }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.customIcon}>
            <FontAwesome name={iconName} size={16} color="white" />
        </View>
        <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
);

const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.text, isActive && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
);

const ListContent = ({ friends, onLongPress }) => {
    // Group friends by first letter
    const sections = groupFriendsByLetter(friends);

    // Render each friend item
    const renderFriend = ({ item }) => (
        <TouchableOpacity
            style={styles.friendItem}
            onLongPress={() => onLongPress(item)} // Add long press handler
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                {item.group && <Text style={styles.groupLabel}>{item.group}</Text>}
            </View>
            <View style={styles.actionIcons}>
                <TouchableOpacity>
                    <Feather name="phone" size={20} color="gray" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="video" size={20} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // Render section header
    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );

    return (
        <SectionList
            sections={sections}
            renderItem={renderFriend}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id}
            style={styles.listContainer}
            stickySectionHeadersEnabled={true} // Make section headers sticky
        />
    );
};

export default function ListFriendsScreen() {
    const [selectedTab, setSelectedTab] = useState('all');
    const [allFriends, setAllFriends] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedFriend, setSelectedFriend] = useState(null); // State for selected friend
    const navigation = useNavigation();

    const friendsToShow = selectedTab === 'all' ? allFriends : recentlyOnlineFriends;

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const data = await FriendService.getFriends(token);
                setAllFriends(data);
            } catch (error) {
                console.error('Failed to fetch friends:', error);
            }
        };

        fetchFriends();
    }, []);

    const handleLongPress = (friend) => {
        setSelectedFriend(friend);
        setModalVisible(true);
    };

    const handleUnfriend = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await FriendService.deleteFriend(selectedFriend.id, token); // Pass correct friendId
            alert(`Unfriended ${selectedFriend.name}`);
            setModalVisible(false);
            setAllFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== selectedFriend.id));
        } catch (error) {
            console.error('Error unfriending:', error);
            alert(error.message || 'Failed to unfriend.');
        }
    };

    const handleMessage = () => {
        // Logic for messaging the selected friend
        alert(`Messaging ${selectedFriend.name}`);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Action Section */}
            <View style={styles.actionWrapper}>
                <ActionItem
                    title="Friend requests (22)"
                    onPress={() => navigation.navigate('FriendRequest')}
                    iconName="users"
                />
                <ActionItem
                    title="Phonebook"
                    onPress={() => navigation.navigate('PhoneBook')}
                    iconName="address-book"
                />
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TabButton title="All" isActive={selectedTab === 'all'} onPress={() => setSelectedTab('all')} />
                <TabButton
                    title="Recently Online"
                    isActive={selectedTab === 'recently'}
                    onPress={() => setSelectedTab('recently')}
                />
            </View>

            {/* Tab Content */}
            <View style={styles.content}>
                <ListContent friends={friendsToShow} onLongPress={handleLongPress} />
            </View>

            {/* Friend Details Modal */}
            {selectedFriend && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade" // Change animation type to "fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)} // Close modal on overlay press
                    >
                        <View style={styles.modalContent}>
                            <Image source={{ uri: selectedFriend.avatar }} style={styles.modalAvatar} />
                            <Text style={styles.modalName}>{selectedFriend.name}</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.unfriendButton} onPress={handleUnfriend}>
                                    <Text style={styles.unfriendText}>Unfriend</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                                    <Text style={styles.messageText}>Message</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    // Action Section
    actionWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    customIcon: {
        backgroundColor: '#007AFF',
        width: 35,
        height: 35,
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        color: '#000',
    },

    // Tab Navigation
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tab: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderColor: '#DEE3E7',
        marginRight: 15,
    },
    activeTab: {
        backgroundColor: '#DEE3E7',
    },
    text: {
        color: '#6D6D6D',
    },
    activeText: {
        color: 'black',
    },

    // Tab Content
    content: {
        flex: 3,
        backgroundColor: '#fff',
        marginTop: 2,
        paddingHorizontal: 15,
    },
    listContainer: {
        flex: 1,
    },
    sectionHeader: {
        backgroundColor: '#fff',
        paddingVertical: 10,
    },
    sectionHeaderText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        color: '#000',
    },
    groupLabel: {
        fontSize: 14,
        color: '#6D6D6D',
    },
    actionIcons: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Increase opacity for a stronger shadow effect
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 15,
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    unfriendButton: {
        backgroundColor: '#E5E5EA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    unfriendText: {
        fontSize: 14,
        color: '#000',
    },
    messageButton: {
        backgroundColor: '#E5F0FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    messageText: {
        fontSize: 14,
        color: '#007AFF',
    },
});
