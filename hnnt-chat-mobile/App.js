import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/common/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import PushNotificationHandler from './src/common/components/PushNotificationHandler';

export default function App() {
    return (
        <Provider store={store}>
            <MenuProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    {/* 👇 Đây là nơi "lắng nghe" notification */}
                    <PushNotificationHandler />
                    <AppNavigator />
                </GestureHandlerRootView>
            </MenuProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
