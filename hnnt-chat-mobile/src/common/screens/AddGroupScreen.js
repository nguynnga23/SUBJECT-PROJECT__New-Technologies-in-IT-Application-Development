import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';

export default function AddGroupScreen() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const layout = useWindowDimensions();
    const [selectedUsers, setSelectedUsers] = useState([]);

    const toggleSelection = (id) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((userId) => userId !== id) : [...prevSelected, id],
        );
    };
    const users = [
        { id: 1, name: 'Nguyễn Nga', lastMessage: 'Hello!', time: '10:30 AM', avatar: 'https://i.pravatar.cc/300' },
        {
            id: 2,
            name: 'Thanh Hậu',
            lastMessage: 'How are you?',
            time: 'Yesterday',
            avatar: 'https://i.pravatar.cc/301',
        },
    ];
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(status === 'granted');
        })();
    }, []);

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

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        setIsInputFocused(false);
    };

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'recent', title: 'RECENT' },
        { key: 'contacts', title: 'CONTACTS' },
    ]);

    const UserItem = ({ user }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => toggleSelection(user.id)}>
            <RadioButton
                value={user.id}
                status={selectedUsers.includes(user.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleSelection(user.id)}
            />
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.lastMessage}>
                    {user.lastMessage} · {user.time}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const RecentRoute = () => (
        <View style={styles.tabContent}>
            {users.map((user) => (
                <UserItem key={user.id} user={user} />
            ))}
        </View>
    );

    const ContactsRoute = () => (
        <View style={styles.tabContent}>
            {users.map((user) => (
                <UserItem key={user.id} user={user} />
            ))}
        </View>
    );
    const renderScene = SceneMap({
        recent: RecentRoute,
        contacts: ContactsRoute,
    });
    return (
        <View style={styles.container}>
            <View style={styles.setNameWrapper}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.avatar} />
                    ) : (
                        <MaterialIcons name="camera-alt" size={30} color="#888" />
                    )}
                </TouchableOpacity>

                <View
                    style={[
                        styles.inputContainer,
                        isInputFocused && { borderBottomWidth: 1, borderBottomColor: '#00A8F5' },
                    ]}
                >
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nhập tên nhóm"
                        value={groupName}
                        onChangeText={setGroupName}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                    />

                    {isInputFocused && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
                            >
                                <MaterialCommunityIcons name="sticker-emoji" size={25} color="grey" />
                            </TouchableOpacity>

                            {/* Nút dấu tích để ẩn bàn phím */}
                            <TouchableOpacity style={styles.iconButton} onPress={dismissKeyboard}>
                                <MaterialIcons name="check" size={30} color="#00A8F5" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.searchWrapper}>
                <View
                    style={[
                        styles.inputContainer,
                        { backgroundColor: '#F2F2F2', width: '100%', height: 40, borderRadius: 10 },
                    ]}
                >
                    <MaterialIcons name="search" size={26} color="gray" />
                    <TextInput placeholder="Search name or phone number" />
                </View>
            </View>

            <View style={styles.listUsersWrapper}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: '#00A8F5' }}
                            style={{ backgroundColor: 'white' }}
                            activeColor="black"
                            inactiveColor="gray"
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        />
                    )}
                />
            </View>
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 60,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: '#aaa',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '80%',
        height: 50,
    },
    textInput: {
        flex: 1,
        height: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    closeEmojiButton: {
        alignItems: 'flex-end',
        padding: 10,
    },
    searchWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    listUsersWrapper: {
        flex: 9,
    },
    tabContent: {
        flex: 1,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
    },
    lastMessage: {
        fontSize: 14,
        color: 'gray',
    },
});
