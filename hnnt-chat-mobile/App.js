import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/common/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export default function App() {
    return (
        <Provider store={store}>
            <MenuProvider>
                <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
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
        justifyContent: 'center',
    },
});
