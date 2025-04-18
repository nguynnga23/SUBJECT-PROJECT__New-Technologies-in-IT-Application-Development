import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const handleFriendRequestNotification = (notification, navigation) => {
    if (navigation) {
        navigation.navigate('FriendRequest');
    } else {
        console.warn('Navigation is undefined');
    }
};

export default function PushNotificationHandler({ navigation }) {
    useEffect(() => {
        // Khi nhận noti khi app đang mở
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            if (notification?.request?.content?.data?.type === 'friend_request') {
                handleFriendRequestNotification(notification, navigation);
            }
        });

        // Khi user bấm vào notification
        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const notification = response.notification;
            console.log('Notification tapped:', notification);
            console.log(notification?.request?.content?.data?.type);
            if (notification?.request?.content?.data?.type === 'friend_request') {
                handleFriendRequestNotification(notification, navigation);
            }
        });

        // Clean up
        return () => {
            subscription.remove();
            responseSubscription.remove();
        };
    }, [navigation]);

    return null; // Không hiển thị gì
}
