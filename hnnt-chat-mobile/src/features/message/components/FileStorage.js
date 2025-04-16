import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SectionList, Image, Modal, StyleSheet, Linking } from 'react-native';

// Fake data for media, files, links, and voices
const sections = [
    {
        title: 'Media',
        data: [
            { id: '1', type: 'image', content: 'https://i.pravatar.cc/150?img=9', date: 'Today' },
            { id: '4', type: 'image', content: 'https://i.pravatar.cc/150?img=8', date: 'April 11, 2025' },
        ],
    },
    {
        title: 'Files',
        data: [{ id: '2', type: 'file', content: 'Document.pdf', date: 'April 15, 2025' }],
    },
    {
        title: 'Links',
        data: [{ id: '3', type: 'link', content: 'https://example.com', date: 'April 15, 2025' }],
    },
    {
        title: 'Voices',
        data: [], // Placeholder for voice data
    },
];

const FileStorage = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Media'); // Add state for selected tab

    const openImageModal = (imageUri) => {
        setSelectedImage(imageUri);
        setModalVisible(true);
    };

    const openLink = (url) => {
        Linking.openURL(url).catch((err) => console.error('Failed to open link:', err));
    };

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
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.type === 'file') {
            return (
                <View style={styles.itemContainer}>
                    <Text style={styles.fileText}>📄 {item.content}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            );
        } else if (item.type === 'link') {
            return (
                <TouchableOpacity onPress={() => openLink(item.content)}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.linkText}>🔗 {item.content}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
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
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
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
});

export default FileStorage;
