import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createGroup, getListFriends } from '../components/services/AddGroupService';

export default function AddGroupScreen() {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

    // Lấy danh sách bạn bè từ API
    const fetchFriends = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await getListFriends(token);
            setFriends(response); // Cập nhật danh sách bạn bè
            setFilteredFriends(response); // Khởi tạo danh sách bạn bè được filter
        } catch (error) {
            console.warn('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        fetchFriends();

        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(status === 'granted');
        })();
    }, []);

    // Chọn ảnh đại diện cho nhóm
    const pickImage = async () => {
        if (!hasGalleryPermission) {
            alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = friends.filter((friend) =>
            friend.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredFriends(filtered);
    };

    // Xử lý chọn/bỏ chọn bạn bè
    const toggleSelection = (id) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((userId) => userId !== id) : [...prevSelected, id]
        );
    };

    // Tạo nhóm mới
    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Tên nhóm không được để trống!');
            return;
        }

        if (selectedUsers.length < 2) {
            Alert.alert('Error', 'Vui lòng chọn ít nhất 2 thành viên!');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const participants = selectedUsers.map((id) => ({ accountId: id }));
            const response = await createGroup(groupName, selectedImage || '', participants, token);

            Alert.alert('Success', 'Nhóm đã được tạo thành công!');
            navigation.navigate('HomeTab')
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Error', 'Không thể tạo nhóm. Vui lòng thử lại.');
        }
    };

    // Render từng bạn bè
    const renderFriendItem = ({ item }) => (
        <TouchableOpacity style={styles.friendItem} onPress={() => toggleSelection(item.id)}>
            <RadioButton
                value={item.id}
                status={selectedUsers.includes(item.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleSelection(item.id)}
            />
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.friendName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Tên nhóm và ảnh đại diện */}
            <View style={styles.setNameWrapper}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.avatar} />
                    ) : (
                        <MaterialIcons name="camera-alt" size={30} color="#888" />
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    placeholder="Nhập tên nhóm"
                    value={groupName}
                    onChangeText={setGroupName}
                />
            </View>

            {/* Tìm kiếm */}
            <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={26} color="gray" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm bạn bè"
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {/* Danh sách bạn bè */}
            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                contentContainerStyle={styles.listContainer}
            />

            {/* Nút tạo nhóm */}
            {selectedUsers.length >= 2 && (
                <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    setNameWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    textInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 16,
        paddingVertical: 5,
    },
    searchWrapper: {
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 20,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    friendName: {
        fontSize: 16,
        flex: 1,
    },
    createButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});