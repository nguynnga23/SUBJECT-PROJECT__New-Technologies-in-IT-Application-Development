import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const BlockMessage = () => {
    // Sample data for blocked users
    const [blockedUsers, setBlockedUsers] = useState([
        { id: '1', name: 'Tài khoản ngừng hoạt động' },
        { id: '2', name: 'Tài khoản ngừng hoạt động' },
        { id: '3', name: 'Le Thi Kim Ngoc', avatar: 'https://via.placeholder.com/50' },
    ]);

    // Function to handle unblocking a user
    const handleUnblock = (id) => {
        setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
        // Add logic here to update the backend or state management
        console.log(`Unblocked user with id: ${id}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.userItem}>
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
                <View style={styles.placeholderAvatar} />
            )}
            <Text style={styles.userName}>{item.name}</Text>
            <TouchableOpacity style={styles.unblockButton} onPress={() => handleUnblock(item.id)}>
                <Text style={styles.unblockText}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.subHeader}>These people can't message you</Text>
            <FlatList
                data={blockedUsers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    list: {
        paddingBottom: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    placeholderAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    userName: {
        flex: 1,
        fontSize: 16,
    },
    unblockButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    unblockText: {
        fontSize: 14,
        color: '#000',
    },
});

export default BlockMessage;
