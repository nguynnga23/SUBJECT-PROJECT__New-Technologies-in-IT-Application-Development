import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, RefreshControl, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { fetchChats } from '../../../message/services/MessageChanelService'; // Import fetchChats
import { formatDateTime } from '../../../../utils/formatDateTime';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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

const ListContent = ({ text }) => (
    <ScrollView style={styles.listContainer}>
        <Text style={styles.textContent}>{text}</Text>
    </ScrollView>
);

export default function Groups() {
    const [selectedTab, setSelectedTab] = useState('all');
    const navigation = useNavigation();
    const [groupChats, setGroupChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false); // State for modal visibility

    const loadGroupChats = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You are not logged in!');
                return;
            }
            const data = await fetchChats(token);
            const groups = data.filter((chat) => chat.isGroup); // Filter only group chats
            setGroupChats(groups);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch group chats.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadGroupChats();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadGroupChats();
        }, []),
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        loadGroupChats();
    }, []);

    const handlePress = (item) => {
        navigation.navigate('MessageStackNavigator', {
            screen: 'GroupChatScreen',
            params: { chatId: item.id, chatName: item.name },
        });
    };

    const handleSort = (criteria) => {
        let sortedChats = [...groupChats];
        if (criteria === 'recent') {
            sortedChats.sort((a, b) => new Date(b.messages[0]?.time || 0) - new Date(a.messages[0]?.time || 0));
        } else if (criteria === 'name') {
            sortedChats.sort((a, b) => a.name.localeCompare(b.name));
        } else if (criteria === 'admin') {
            sortedChats.sort((a, b) => a.admin.localeCompare(b.admin));
        }
        setGroupChats(sortedChats);
        setSortModalVisible(false); // Close modal after sorting
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Image
                source={{
                    uri: item.avatar || 'https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg',
                }}
                style={styles.avatar}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>
                        {item.messages.length > 0 ? formatDateTime(item.messages[0].time) : ''}
                    </Text>
                </View>
                <Text style={styles.message}>
                    {item.messages.length > 0 ? item.messages[0].content : 'No messages yet'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading group chats...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Action Section */}
            <View style={styles.actionWrapper}>
                <ActionItem title="Create Group" onPress={() => navigation.navigate('New Group')} iconName="users" />
            </View>
            {/* Nội dung tab */}
            <View style={styles.contentWrapper}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        paddingVertical: 10,
                    }}
                >
                    <View>
                        <Text style={{ fontWeight: 600 }}>Joined Groups ({groupChats.length})</Text>
                        {/* Dynamically display the count */}
                    </View>
                    <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                        <Text style={{ fontWeight: 600 }}>Recent activity</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={groupChats}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                />
            </View>

            {/* Sort Modal */}
            <Modal
                visible={sortModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sort By</Text>
                        <TouchableOpacity onPress={() => handleSort('recent')} style={styles.modalOption}>
                            <Text>Recent Activity</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSort('name')} style={styles.modalOption}>
                            <Text>Group Name</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSort('admin')} style={styles.modalOption}>
                            <Text>Admin Group</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSortModalVisible(false)} style={styles.modalClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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

    // Nội dung tab
    contentWrapper: {
        flex: 7,
        backgroundColor: '#fff',
        marginTop: 2,
        paddingHorizontal: 15,
    },

    item: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    message: {
        fontSize: 14,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalOption: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalClose: {
        marginTop: 15,
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
});
