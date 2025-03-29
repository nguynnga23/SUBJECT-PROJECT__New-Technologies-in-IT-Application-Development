import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import friendService from '../../../services/FriendService';
// Sample data for friend requests
const receivedRequests = [
    {
        title: 'January, 2025',
        data: [
            {
                id: '1',
                name: 'Bùi Ngọc Thu',
                date: '17/01',
                mutual: 'From Mutual group',
                avatar: 'https://i.pravatar.cc/150?img=5',
            },
        ],
    },
    {
        title: 'Older',
        data: [
            {
                id: '2',
                name: 'BVinh',
                message: 'Wants to be friends',
                avatar: 'https://i.pravatar.cc/150?img=6',
            },
            {
                id: '3',
                name: 'Ngô Quốc Đạt',
                message: 'Wants to be friends',
                avatar: 'https://i.pravatar.cc/150?img=7',
            },
        ],
    },
];

const sentRequests = [
    {
        title: 'January, 2025',
        data: [
            {
                id: '4',
                name: 'Trần Văn An',
                date: '15/01',
                mutual: 'From Mutual friends',
                avatar: 'https://i.pravatar.cc/150?img=8',
            },
        ],
    },
];

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
const FriendRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.requestInfo}>
            <Text style={styles.requestName}>{item.name}</Text>
            <Text style={styles.requestDetails}>{item.date ? `${item.date} • ${item.mutual}` : item.message}</Text>
        </View>
        <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.declineButton}>
                <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
        </View>
    </View>
);

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

export default function FriendRequestScreen() {
    const [selectedTab, setSelectedTab] = useState('received');
    const navigation = useNavigation();
    const [sentRequests, setSentRequests] = useState([]);
    // Determine which list to show based on the selected tab

    const requestsToShow = selectedTab === 'received' ? receivedRequests : sentRequests;
    useEffect(() => {
        friendService.getFriendRequests();
    }, []);

    return (
        <View style={styles.container}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TabButton
                    title="Received 22"
                    isActive={selectedTab === 'received'}
                    onPress={() => setSelectedTab('received')}
                />
                <TabButton title="Sent 1" isActive={selectedTab === 'sent'} onPress={() => setSelectedTab('sent')} />
            </View>

            {/* Friend Requests List */}
            <SectionList
                sections={requestsToShow}
                renderItem={({ item }) => <FriendRequestItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.listContainer}
                stickySectionHeadersEnabled={true}
                ListFooterComponent={
                    <>
                        {/* See More Button */}
                        <TouchableOpacity style={styles.seeMoreButton}>
                            <Text style={styles.seeMoreText}>SEE MORE</Text>
                            <FontAwesome name="chevron-down" size={16} color="#000" style={styles.seeMoreIcon} />
                        </TouchableOpacity>

                        {/* People You May Know Section */}
                        <View style={styles.peopleSection}>
                            <Text style={styles.peopleSectionTitle}>People you may know</Text>
                            {peopleYouMayKnow.map((item) => (
                                <PeopleYouMayKnowItem key={item.id} item={item} />
                            ))}
                        </View>
                    </>
                }
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DEE3E7',
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    requestDetails: {
        fontSize: 14,
        color: '#6D6D6D',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    declineButton: {
        backgroundColor: '#E5E5EA',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
    },
    declineText: {
        fontSize: 14,
        color: '#000',
    },
    acceptButton: {
        backgroundColor: '#E5F0FF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    acceptText: {
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
