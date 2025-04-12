import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import friendService from '../../../services/FriendService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample data for "People You May Know"
const peopleYouMayKnow = [
    {
        id: '5',
        name: 'P',
        message: 'From In your p...',
        avatar: 'https://i.pravatar.cc/150?img=9',
    },
];

// Tab Button Component
const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
);

// Friend Request Item Component
const FriendRequestItem = ({ item }) => {
    const handleDecline = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!item.requestId) {
                alert('Invalid request ID!');
                return;
            }
            await friendService.cancelFriendRequest(item.requestId, token); // Call cancel API
            alert('Friend request declined!');
        } catch (error) {
            console.error('Error declining friend request:', error);
            alert(error.response?.data?.message || 'Failed to decline friend request.');
        }
    };

    const handleAccept = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await friendService.acceptFriendRequest(item.requestId, token); // Call accept API
            alert('Friend request accepted!');
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    return (
        <View style={styles.requestItem}>
            <View style={styles.requestInfoBlock}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.requestInfo}>
                    <View style={{ paddingBottom: 6 }}>
                        <Text style={styles.requestName}>{item.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.requestDetails}>Wants to be friends</Text>
                    </View>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                    <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// People You May Know Item Component
const PeopleYouMayKnowItem = ({ item }) => (
    <View style={styles.peopleItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.peopleInfo}>
            <Text style={styles.peopleName}>{item.name}</Text>
            <Text style={styles.peopleDetails}>{item.message}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
    </View>
);

const handleUnfriend = async (friendId) => {
    try {
        const token = await AsyncStorage.getItem('token'); // Retrieve token
        if (!friendId) {
            alert('Invalid friend ID!');
            return;
        }
        await friendService.deleteFriend(friendId, token); // Call delete friend API
        alert('Friend removed successfully!');
        // Optionally, refresh the friend list or update the UI
    } catch (error) {
        console.error('Error unfriending:', error);
        alert(error.response?.data?.message || 'Failed to unfriend.');
    }
};

export default function FriendRequestScreen() {
    const [selectedTab, setSelectedTab] = useState('received');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Retrieve token
                const userId = await AsyncStorage.getItem('userId'); // Retrieve userId
                const requests = await friendService.getFriendRequests(token, userId); // Pass userId
                console.log(requests);
                setReceivedRequests(requests); // Update received requests
                setSentRequests(requests); // Update sent requests
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
    }, []);

    const requestsToShow = selectedTab === 'received' ? receivedRequests : sentRequests;

    return (
        <View style={styles.container}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TabButton
                    title={`Received ${receivedRequests.length}`}
                    isActive={selectedTab === 'received'}
                    onPress={() => setSelectedTab('received')}
                />
                <TabButton
                    title={`Sent ${sentRequests.length}`}
                    isActive={selectedTab === 'sent'}
                    onPress={() => setSelectedTab('sent')}
                />
            </View>

            {/* Friend Requests List */}
            <SectionList
                sections={[
                    { title: selectedTab === 'received' ? 'Received Requests' : 'Sent Requests', data: requestsToShow },
                ]}
                renderItem={({ item }) => <FriendRequestItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => `${selectedTab}-${item.id || `fallback-${index}`}`} // Ensure unique keys
                style={styles.listContainer}
                stickySectionHeadersEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Tab Navigation
    tabContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomColor: '#DEE3E7',
    },
    tab: {
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
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
    // Friend Requests List
    listContainer: {
        flex: 1,
    },
    sectionHeader: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6D6D6D',
    },
    requestItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    requestInfoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // Add spacing between the info block and buttons
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    requestInfo: {
        flex: 1,
    },
    requestName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#000',
    },
    requestDetails: {
        fontSize: 16,
        color: '#6D6D6D',
    },
    actionButtons: {
        flexDirection: 'row',
        marginLeft: 65,
    },
    declineButton: {
        backgroundColor: '#E5E5EA',
        paddingVertical: 8,
        paddingHorizontal: 20,
        width: 100,
        alignItems: 'center',
        borderRadius: 20,
        marginRight: 10,
    },
    declineText: {
        fontWeight: 600,
        fontSize: 14,
        color: '#000',
    },
    acceptButton: {
        backgroundColor: '#E5F0FF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        width: 100,
        borderRadius: 20,
        alignItems: 'center',
        width: 100,
    },
    acceptText: {
        fontWeight: 600,

        fontSize: 14,
        color: '#007AFF',
    },
    // See More Button
    seeMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    seeMoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 5,
    },
    seeMoreIcon: {
        marginLeft: 5,
    },
    // People You May Know Section
    peopleSection: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    peopleSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    peopleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DEE3E7',
    },
    peopleInfo: {
        flex: 1,
    },
    peopleName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    peopleDetails: {
        fontSize: 14,
        color: '#6D6D6D',
    },
    addButton: {
        backgroundColor: '#E5F0FF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    addText: {
        fontSize: 14,
        color: '#007AFF',
    },
});
