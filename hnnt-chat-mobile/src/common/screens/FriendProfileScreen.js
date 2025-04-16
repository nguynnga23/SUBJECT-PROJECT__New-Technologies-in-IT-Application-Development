import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import friendService from '../../features/contact/services/FriendService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import CustomAlert from '../components/CustomAlert'; // Import CustomAlert
import UndoModal from '../components/UndoModal'; // Import the new UndoModal component
import ProfileService from '../../features/profile/services/ProfileService';

const FriendProfileScreen = () => {
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user || null);
    const [refreshing, setRefreshing] = useState(false);
    const [friendStatus, setFriendStatus] = useState({
        isFriend: false,
        requestSent: false,
        requestExists: false,
        isSender: false,
        isReceiver: false,
    });
    const [customAlert, setCustomAlert] = useState({
        visible: false,
        title: '',
        message: '',
        onConfirm: null,
    });
    const [undoModal, setUndoModal] = useState({ visible: false, message: '', onUndo: null });

    useEffect(() => {
        const checkFriendStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (user?.id && token) {
                    const response = await friendService.checkFriend(user.id, token);
                    const isFriend = response.result || false;

                    const requestResponse = await friendService.checkFriendRequest(user.id, token);
                    const requestExists = requestResponse.exists || false;

                    setFriendStatus({
                        isFriend,
                        requestSent: false,
                        requestExists,
                        isSender: requestResponse.isSender || false,
                        isReceiver: requestResponse.isReceiver || false,
                    });
                    console.log(friendStatus);
                }
            } catch (error) {
                setFriendStatus({
                    isFriend: false,
                    requestSent: false,
                    requestExists: false,
                    isSender: false,
                    isReceiver: false,
                });
            }
        };

        checkFriendStatus();
    }, [user]);

    useEffect(() => {
        const fetchUserById = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                console.log('Token:', token);

                const userId = route.params?.userId;
                console.log('UserID from params:', route.params?.userId);
                if (userId && token) {
                    const fetchedUser = await ProfileService.getUserById(token, userId);
                    setUser(fetchedUser);
                } else {
                    console.warn('Missing token or userId');
                }
            } catch (error) {
                console.error('Error fetching user by IDD:', error);
            }
        };

        if (!user && route.params?.userId) {
            fetchUserById();
        }
    }, [route.params?.userId]);

    const showCustomAlert = (title, message, onConfirm) => {
        setCustomAlert({ visible: true, title, message, onConfirm });
    };

    const showUndoModal = (message, onUndo) => {
        setUndoModal({ visible: true, message, onUndo });
        setTimeout(() => setUndoModal({ visible: false, message: '', onUndo: null }), 3000);
    };

    const handleSendFriendRequest = async () => {
        showCustomAlert('Confirm Friend Request', 'Are you sure you want to send a friend request?', async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (user?.id && token) {
                    await friendService.sendFriendRequest(user.id, token);
                    showUndoModal('Friend request sent!');
                    setFriendStatus((prev) => ({
                        ...prev,
                        requestSent: true,
                        requestExists: true,
                    }));
                }
            } catch (error) {
                console.error('Error sending friend request:', error);
                alert('Failed to send friend request.');
            }
        });
    };

    const handleRecallFriendRequest = async () => {
        showCustomAlert('Confirm Recall', 'Are you sure you want to recall the friend request?', async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (user?.id && token) {
                    await friendService.cancelSentFriendRequest(user.id, token);
                    showUndoModal('Friend request recalled!');
                    setFriendStatus((prev) => ({
                        ...prev,
                        requestSent: false,
                        requestExists: false,
                    }));
                }
            } catch (error) {
                console.error('Error recalling friend request:', error);
                alert('Failed to recall friend request.');
            }
        });
    };

    const handleUnfriend = async () => {
        showCustomAlert('Confirm Unfriend', 'Are you sure you want to unfriend this user?', async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (user?.id && token) {
                    await friendService.deleteFriend(user.id, token);
                    showUndoModal('Unfriended successfully!');
                    setFriendStatus((prev) => ({
                        ...prev,
                        isFriend: false,
                    }));
                }
            } catch (error) {
                console.error('Error unfriending:', error);
                alert('Failed to unfriend.');
            }
        });
    };

    const handleAcceptFriendRequest = async () => {
        showCustomAlert('Confirm Accept', 'Are you sure you want to accept this friend request?', async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (user?.id && token) {
                    await friendService.acceptFriendRequest(user.id, token);
                    showUndoModal('Friend request accepted!');
                    setFriendStatus((prev) => ({
                        ...prev,
                        isFriend: true,
                        requestExists: false,
                    }));
                }
            } catch (error) {
                console.error('Error accepting friend request:', error);
                alert('Failed to accept friend request.');
            }
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const updatedUser = route.params?.user;
            setUser(updatedUser);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    if (!user) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Undo Modal */}
            <UndoModal visible={undoModal.visible} message={undoModal.message} onUndo={undoModal.onUndo} />
            {/* Custom Alert */}
            <CustomAlert
                visible={customAlert.visible}
                title={customAlert.title}
                message={customAlert.message}
                onCancel={() => setCustomAlert({ ...customAlert, visible: false })}
                onConfirm={() => {
                    customAlert.onConfirm();
                    setCustomAlert({ ...customAlert, visible: false });
                }}
            />

            {/* Background Image as Fixed Header */}
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.backgroundImage}>
                {/* Profile Picture */}
                <View style={styles.profilePictureContainer}>
                    <Image
                        source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=20' }}
                        style={styles.profilePicture}
                    />
                </View>
            </ImageBackground>

            {/* Scrollable Content with Pull-to-Refresh */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Username and Privacy Message */}
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{user.name || 'Unknown User'}</Text>
                </View>

                {/* Buttons Container */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.sendMessageButton}>
                        <Text style={styles.sendMessageText}>Send message</Text>
                    </TouchableOpacity>
                    {friendStatus.isFriend ? (
                        <TouchableOpacity style={styles.unfriendButton} onPress={handleUnfriend}>
                            <Text style={styles.unfriendText}>Unfriend</Text>
                        </TouchableOpacity>
                    ) : friendStatus.requestExists ? (
                        friendStatus.isReceiver ? (
                            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptFriendRequest}>
                                <Text style={styles.acceptText}>Accept</Text>
                            </TouchableOpacity>
                        ) : friendStatus.isSender ? (
                            <TouchableOpacity style={styles.recallButton} onPress={handleRecallFriendRequest}>
                                <Text style={styles.recallText}>Recall</Text>
                            </TouchableOpacity>
                        ) : null
                    ) : (
                        <TouchableOpacity style={styles.sendFriendRequestIconButton} onPress={handleSendFriendRequest}>
                            <AntDesign name="adduser" size={24} color="black" />
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F8',
    },
    backgroundImage: {
        height: 200,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    profilePictureContainer: {
        position: 'absolute',
        bottom: -50,
        alignSelf: 'center',
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#fff',
    },
    scrollContent: {
        paddingTop: 250, // To account for the fixed header
    },
    profileInfo: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    name: {
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    privacyMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
        marginHorizontal: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    sendMessageButton: {
        backgroundColor: '#E7F3FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: 200,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    sendMessageText: {
        color: '#1E90FF',
        fontSize: 16,
        fontWeight: '700',
    },
    peopleYouMayKnowContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    seeMore: {
        fontSize: 14,
        color: '#1E90FF',
    },
    personCard: {
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
        width: 100,
    },
    personImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
    },
    personName: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: '#E7F3FF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    addButtonText: {
        color: '#1E90FF',
        fontSize: 12,
        fontWeight: '600',
    },
    sendFriendRequestButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        width: 100,
    },
    sendFriendRequestText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    sendFriendRequestIconButton: {
        backgroundColor: '#fff', // Gray background
        padding: 10,
        borderRadius: 50, // Circular button
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    unfriendButton: {
        backgroundColor: '#fff', // Tomato color for unfriend
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    unfriendText: {
        fontSize: 16,
        fontWeight: '700',
    },
    recallButton: {
        backgroundColor: '#FFA500', // Orange color for recall
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    recallText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    acceptButton: {
        backgroundColor: '#32CD32', // Green color for accept
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    acceptText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slightly transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#F9F9F9', // Light gray background
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonCancel: {
        flex: 1,
        backgroundColor: '#E0E0E0', // Light gray for cancel
        paddingVertical: 12,
        borderRadius: 10,
        marginRight: 5,
        alignItems: 'center',
    },
    modalButtonConfirm: {
        flex: 1,
        backgroundColor: '#007AFF', // iOS blue for confirm
        paddingVertical: 12,
        borderRadius: 10,
        marginLeft: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    undoModal: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    undoMessage: {
        color: '#fff',
        fontSize: 14,
    },
    undoButton: {
        color: '#1E90FF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default FriendProfileScreen;
