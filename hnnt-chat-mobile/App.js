import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/common/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
export default function App() {
    return (
        // <View style={styles.container}>
        //   <Text>Open up App.tsx to start working on your app!</Text>
        //   <StatusBar style="auto" />
        // </View>
        <Provider store={store}>
            <MenuProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
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
