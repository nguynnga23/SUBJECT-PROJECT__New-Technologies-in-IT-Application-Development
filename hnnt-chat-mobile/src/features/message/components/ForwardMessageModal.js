import React, { useState } from 'react';
import {
    Modal,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForwardMessageModal({ visible, chats, selectedMessage, currentUserId, onClose, onForward }) {
    const [selectedChats, setSelectedChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleChatSelection = (chatId) => {
        setSelectedChats((prev) => (prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]));
    };

    const filteredChats = chats.filter((chat) => {
        const participant = chat.participants.find((p) => p.account.id !== currentUserId);
        return participant?.account.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Share message</Text>
                                <Text style={styles.headerSubtitle}>Selected: {selectedChats.length}</Text>
                            </View>
                            {/* Search Input */}
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                                <TextInput
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    style={styles.searchInput}
                                />
                            </View>

                            {/* Danh sách chat */}
                            <FlatList
                                data={filteredChats}
                                keyExtractor={(item) => item.id}
                                style={{ maxHeight: 320 }}
                                renderItem={({ item }) => {
                                    const otherParticipant = item.participants.find(
                                        (p) => p.account.id !== currentUserId,
                                    );
                                    const isSelected = selectedChats.includes(item.id);
                                    return (
                                        <TouchableOpacity
                                            style={[styles.messageItem, isSelected && styles.selectedItem]}
                                            onPress={() => toggleChatSelection(item.id)}
                                        >
                                            <View style={styles.radioButton}>
                                                {isSelected && <View style={styles.radioButtonInner} />}
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    width: '90%',
                                                    alignItems: 'center',
                                                    marginLeft: 20,
                                                }}
                                            >
                                                <Image
                                                    source={{
                                                        uri: otherParticipant?.account.avatar || 'default-avatar-url',
                                                    }}
                                                    style={styles.avatar}
                                                />
                                                <Text style={styles.messageText}>
                                                    {otherParticipant?.account.name || 'Unknown'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />

                            {/* Danh sách đã chọn */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.selectedContainer}
                            >
                                {selectedChats.map((chatId) => {
                                    const chat = chats.find((c) => c.id === chatId);
                                    const other = chat.participants.find((p) => p.account.id !== currentUserId);
                                    return (
                                        <View key={chatId} style={styles.selectedAvatarWrapper}>
                                            <Image
                                                source={{ uri: other?.account.avatar || 'default-avatar-url' }}
                                                style={styles.selectedAvatar}
                                            />
                                            <TouchableOpacity
                                                onPress={() => toggleChatSelection(chatId)}
                                                style={styles.removeButton}
                                            >
                                                <Ionicons name="close" size={12} color="#333" />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>

                            {/* Nút gửi */}
                            {selectedChats.length > 0 && (
                                <TouchableOpacity
                                    style={styles.sendButton}
                                    onPress={() => onForward(selectedMessage, selectedChats)}
                                >
                                    <Ionicons name="send" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker overlay
    },
    modalContent: {
        width: '95%',
        maxHeight: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 20, // More rounded corners
        padding: 16, // Increased padding
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8, // Better shadow for Android
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#f8f8f8',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    messageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14, // Slightly larger padding
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 14, // More rounded corners
        marginBottom: 12, // Increased spacing
    },
    selectedItem: {
        backgroundColor: '#e6f7ff', // Softer highlight color
    },
    messageText: {
        fontSize: 16,
        color: '#333', // Slightly darker text
        fontWeight: '500',
    },
    avatar: {
        width: 48, // Larger avatar
        height: 48,
        borderRadius: 24,
        marginRight: 14, // Better spacing
        backgroundColor: '#f0f0f0',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF', // Border color for the circle
        borderRadius: 12, // Makes it a circle
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        backgroundColor: '#007AFF', // Fill color for the selected state
        borderRadius: 6, // Makes it a smaller circle
    },
    selectedContainer: {
        flexDirection: 'row',
        marginTop: 15,
        height: 60,
        paddingVertical: 10, // Increased padding
        paddingHorizontal: 8,
    },
    selectedAvatarWrapper: {
        position: 'relative',
        marginRight: 12, // Better spacing
    },
    selectedAvatar: {
        width: 42, // Slightly larger avatar
        height: 42,
        borderRadius: 21,
        backgroundColor: '#f0f0f0',
    },
    removeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Subtle shadow
    },
    sendButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56, // Larger button
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8, // Better shadow
    },
});
