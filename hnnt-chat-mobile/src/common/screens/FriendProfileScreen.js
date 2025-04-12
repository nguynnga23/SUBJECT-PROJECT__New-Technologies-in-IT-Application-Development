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
    Alert, // Import Alert for confirmation dialogs
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import friendService from '../../features/contact/services/FriendService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, AntDesign } from '@expo/vector-icons'; // Import FontAwesome for the icon

const FriendProfileScreen = () => {
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user || null);
    const [refreshing, setRefreshing] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [requestSent, setRequestSent] = useState(false); // New state to track if a request was sent
    const [requestExists, setRequestExists] = useState(false); // New state to track if a request exists
    const [canAcceptRequest, setCanAcceptRequest] = useState(false); // New state to track if the request can be accepted
    const [isSender, setIsSender] = useState(false); // New state to track if the user is the sender
    const [isReceiver, setIsReceiver] = useState(false); // New state to track if the user is the receiver

    useEffect(() => {
        const checkFriendStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (user?.id && token) {
                    const response = await friendService.checkFriend(user.id, token);
                    setIsFriend(response.result || false); // Set to false if not found

                    // Check if a friend request exists
                    const requestResponse = await friendService.checkFriendRequest(user.id, token);
                    if (requestResponse.exists) {
                        setRequestExists(true);
                        setIsSender(requestResponse.isSender || false); // Determine if the user is the sender
                        setIsReceiver(requestResponse.isReceiver || false); // Determine if the user is the receiver
                    } else {
                        setRequestExists(false);
                        setIsSender(false);
                        setIsReceiver(false);
                    }
                }
            } catch (error) {
                setIsFriend(false); // Default to not a friend if an error occurs
                setRequestExists(false); // Default to no request if an error occurs
                setIsSender(false);
                setIsReceiver(false);
            }
        };

        checkFriendStatus();
    }, [user]);

    const handleSendFriendRequest = async () => {
        Alert.alert('Confirm Friend Request', 'Are you sure you want to send a friend request?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Send',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        if (user?.id && token) {
                            await friendService.sendFriendRequest(user.id, token);
                            alert('Friend request sent!');
                            setRequestSent(true); // Update state to reflect the request was sent
                        }
                    } catch (error) {
                        console.error('Error sending friend request:', error);
                        alert('Failed to send friend request.');
                    }
                },
            },
        ]);
    };

    const handleRecallFriendRequest = async () => {
        Alert.alert('Confirm Recall', 'Are you sure you want to recall the friend request?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Recall',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        if (user?.id && token) {
                            await friendService.cancelSentFriendRequest(user.id, token);
                            alert('Friend request recalled!');
                            setRequestSent(false); // Update state to reflect the request was recalled
                        }
                    } catch (error) {
                        console.error('Error recalling friend request:', error);
                        alert('Failed to recall friend request.');
                    }
                },
            },
        ]);
    };

    const handleUnfriend = async () => {
        Alert.alert('Confirm Unfriend', 'Are you sure you want to unfriend this user?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Unfriend',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        if (user?.id && token) {
                            await friendService.deleteFriend(user.id, token);
                            alert('Unfriended successfully!');
                            setIsFriend(false); // Update state to reflect the change
                        }
                    } catch (error) {
                        console.error('Error unfriending:', error);
                        alert('Failed to unfriend.');
                    }
                },
            },
        ]);
    };

    const handleAcceptFriendRequest = async () => {
        Alert.alert('Confirm Accept', 'Are you sure you want to accept this friend request?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Accept',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        if (user?.id && token) {
                            await friendService.acceptFriendRequest(user.id, token);
                            alert('Friend request accepted!');
                            setIsFriend(true); // Update state to reflect the change
                            setRequestExists(false); // Clear the request state
                        }
                    } catch (error) {
                        console.error('Error accepting friend request:', error);
                        alert('Failed to accept friend request.');
                    }
                },
            },
        ]);
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
                    <Text style={styles.privacyMessage}>{user.privacyMessage || 'This is your profile.'}</Text>
                </View>

                {/* Buttons Container */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.sendMessageButton}>
                        <Text style={styles.sendMessageText}>Send message</Text>
                    </TouchableOpacity>
                    {isFriend ? (
                        <TouchableOpacity style={styles.unfriendButton} onPress={handleUnfriend}>
                            <Text style={styles.unfriendText}>Unfriend</Text>
                        </TouchableOpacity>
                    ) : requestExists ? (
                        isReceiver ? (
                            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptFriendRequest}>
                                <Text style={styles.acceptText}>Accept</Text>
                            </TouchableOpacity>
                        ) : isSender ? (
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
});

export default FriendProfileScreen;
