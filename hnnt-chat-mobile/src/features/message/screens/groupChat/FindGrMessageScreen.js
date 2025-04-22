import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchMessage } from '../../services/GroupChat/GroupInfoService';

export default function FindGrMessagesScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId } = route.params || 'null';
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const results = await searchMessage(chatId, token, searchQuery);
            console.log('Search results:', results);
            setFilteredMessages(results.messages); // Lấy danh sách tin nhắn từ `messages`
        } catch (error) {
            console.error('Error searching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaProvider>
                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter search query..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>

                {/* Message List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                ) : filteredMessages.length > 0 ? (
                    <FlatList
                        data={filteredMessages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.messageItem}>
                                <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />
                                <View style={styles.messageContent}>
                                    <Text style={styles.senderName}>{item.sender.name}</Text>
                                    <Text style={styles.messageText}>{item.content}</Text>
                                    <Text style={styles.messageTime}>
                                        {new Date(item.time).toLocaleString()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>No messages found.</Text>
                    </View>
                )}
            </SafeAreaProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageContent: {
        flex: 1,
    },
    senderName: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
    messageText: {
        color: '#333',
    },
    messageTime: {
        fontSize: 12,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'gray',
        fontSize: 16,
    },
    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        color: 'gray',
        fontSize: 16,
    },
});