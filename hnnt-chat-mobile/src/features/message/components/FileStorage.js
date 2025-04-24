import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, SectionList, Image, Modal, StyleSheet, Linking, Alert } from 'react-native';
import { fetchMessages, downloadImage, downloadAnyFile } from '../services/ChatService'; // Import fetchMessages
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDateTime } from '../../../utils/formatDateTime';
import { Ionicons } from '@expo/vector-icons';

const FileStorage = () => {
    const route = useRoute();
    const { chatId } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFileVisible, setModalFileVisible] = useState(false);
    const [modalAudioVisible, setModalAudioVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Media'); // Add state for selected tab
    const [sections, setSections] = useState([]); // State for sections

    const openImageModal = (imageUri) => {
        setSelectedFile(imageUri);
        setModalVisible(true);
    };

    const openLink = (url) => {
        Linking.openURL(url).catch((err) => console.error('Failed to open link:', err));
    };

    // Fetch messages and categorize them
    const loadMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You are not logged in!');
                return;
            }

            const messages = await fetchMessages(chatId, token);

            // Categorize messages
            const media = messages.filter((msg) => msg.type === 'image' || msg.type === 'video').map((msg) => ({
                id: msg.id,
                type: 'image' || 'video',
                content: msg.content,
                fileName: msg.fileName,
                time: formatDateTime(msg.time),
            }));

            const files = messages.filter((msg) => msg.type === 'file').map((msg) => ({
                id: msg.id,
                type: 'file',
                content: msg.content,
                fileName: msg.fileName,
                time: formatDateTime(msg.time),
            }));

            const links = messages.filter((msg) => msg.type === 'link').map((msg) => ({
                id: msg.id,
                type: 'link',
                content: msg.content,
                fileName: msg.fileName,
                time: formatDateTime(msg.time),
            }));

            const voices = messages.filter((msg) => msg.type === 'audio').map((msg) => ({
                id: msg.id,
                type: 'audio',
                content: msg.content.split('/').pop(),
                fileName: msg.fileName,
                time: formatDateTime(msg.time),
            }));

            setSections([
                { title: 'Media', data: media },
                { title: 'Files', data: files },
                { title: 'Links', data: links },
                { title: 'Voices', data: voices },
            ]);
        } catch (error) {
            console.error('Error loading messages:', error);
            Alert.alert('Error', 'Failed to load messages.');
        }
    };

    useEffect(() => {
        loadMessages();
    }, [chatId]);

    const filteredSections = sections.filter((section) => section.title === selectedTab);

    const TabButton = ({ title, isActive, onPress }) => (
        <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress} activeOpacity={0.7}>
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        if (item.type === 'image') {
            return (
                <TouchableOpacity onPress={() => openImageModal(item.content)}>
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: item.content }} style={styles.thumbnail} />
                        <Text style={styles.date}>{item.time}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.type === 'file') {
            return (
                <TouchableOpacity style={styles.itemContainer_column} onPress={() => {
                    setSelectedFile(item.content);
                    setModalFileVisible(true);
                }}>
                    <Text style={styles.fileText}>📄 {item.fileName}</Text>
                    <Text style={styles.date}>{item.time}</Text>
                </TouchableOpacity>
            );
        } else if (item.type === 'link') {
            return (
                <TouchableOpacity onPress={() => Linking.openURL(item.content)}>
                    <View style={styles.itemContainer_column}>
                        <Text style={styles.linkText}>🔗 {item.content}</Text>
                        <Text style={styles.date}>{item.time}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.type === 'audio') {
            return (
                <TouchableOpacity style={styles.itemContainer_column} onPress={() => {
                    setSelectedFile(item.content);
                    setModalAudioVisible(true);
                }}>
                    <Text style={styles.fileText}>{item.content}</Text>
                    <Text style={styles.date}>{item.time}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                {sections.map((section) => (
                    <TabButton
                        key={section.title}
                        title={section.title}
                        isActive={selectedTab === section.title}
                        onPress={() => setSelectedTab(section.title)}
                    />
                ))}
            </View>

            {/* Section List */}
            <SectionList
                sections={filteredSections}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.list}
            />

            {/* Modal for full-screen image */}
            <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={async () => {
                        await downloadImage(selectedFile);
                        setModalVisible(false)
                    }}
                    >
                        <Ionicons name="download-outline" style={styles.saveButtonText} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    {selectedFile && <Image source={{ uri: selectedFile }} style={styles.fullImage} />}
                </View>
            </Modal>

            {/* Modal for file download and preview */}
            <Modal visible={modalFileVisible} transparent={true} onRequestClose={() => setModalFileVisible(false)}>
                <View style={styles.modalFileContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titleModal}>Download this file?</Text>

                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await downloadAnyFile(selectedFile);
                            setModalFileVisible(false)
                        }}
                        >
                            <Text style={styles.buttonText}>Download</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.button} onPress={async () => {
                        await Linking.openURL(selectedFile).catch((err) => console.error('Failed to open link:', err));
                        setModalFileVisible(false)
                    }}
                    >
                        <Text style={styles.buttonText}>Preview</Text>
                    </TouchableOpacity> */}
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalFileVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for voice message download */}
            <Modal visible={modalAudioVisible} transparent={true} onRequestClose={() => setModalFileVisible(false)}>
                <View style={styles.modalFileContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titleModal}>Download this file?</Text>

                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await downloadAnyFile(selectedFile);
                            setModalAudioVisible(false)
                        }}
                        >
                            <Text style={styles.buttonText}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalAudioVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        flex: 1,
    },
    sectionHeader: {
        backgroundColor: '#ddd',
        padding: 10,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemContainer_column: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    fileText: {
        fontSize: 16,
        color: '#333',
    },
    linkText: {
        fontSize: 16,
        color: '#007AFF',
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginLeft: 'auto',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    saveButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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

    modalFileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền mờ
        padding: 20,
    },
    modalContent: {
        width: '80%', // Chiều rộng modal
        backgroundColor: '#fff', // Nền trắng
        borderRadius: 10, // Bo góc
        padding: 20, // Khoảng cách bên trong
        alignItems: 'center', // Căn giữa nội dung
        shadowColor: '#000', // Đổ bóng
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Đổ bóng trên Android
    },
    titleModal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FF3B30',
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FileStorage;
