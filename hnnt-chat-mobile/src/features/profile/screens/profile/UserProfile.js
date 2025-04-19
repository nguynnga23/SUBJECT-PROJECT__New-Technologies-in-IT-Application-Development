import React, { useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserData } from '../../utils/fetchUserData';
import { useRoute } from '@react-navigation/native';

const UserProfile = () => {
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user || null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const user = await fetchUserData();
            setUser(user);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                try {
                    const user = await fetchUserData();
                    setUser(user);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchUser();
        }, []),
    );

    if (!user) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Background Image as Fixed Header */}
            <ImageBackground
                source={require('../../../../assets/images/background.png')}
                style={styles.backgroundImage}
            >
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

                {/* Send Message Button */}
                <TouchableOpacity style={styles.sendMessageButton}>
                    <Text style={styles.sendMessageText}>Send message</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    sendMessageButton: {
        backgroundColor: '#E7F3FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 10,
    },
    sendMessageText: {
        color: '#1E90FF',
        fontSize: 16,
        fontWeight: '600',
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
});

export default UserProfile;
