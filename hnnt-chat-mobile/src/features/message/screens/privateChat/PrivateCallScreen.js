import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function PrivateCallScreen() {
    const navigation = useNavigation();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity style={{ paddingRight: 20, paddingLeft: 10 }} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.name}>Receiver</Text>
                </View>
                {/* WebView for Video Call */}
                <View style={styles.webViewContainer}>
                    <WebView
                        source={{ uri: 'https://hnntchat.daily.co/Test' }} // Replace with your video call URL
                        style={styles.webView}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        mediaPlaybackRequiresUserAction={false} // Allow media playback without user interaction
                        allowsInlineMediaPlayback={true} // Enable inline media playback
                        startInLoadingState={true} // Show a loading indicator while the WebView loads
                        renderLoading={() => (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white' }}>Loading...</Text>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    name: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    webViewContainer: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 15,
        overflow: 'hidden',
    },
    webView: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50,
        justifyContent: 'space-evenly',
        width: '100%',
    },
    button: {
        width: 90,
        height: 90,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    endCallButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        marginTop: 2,
    },
});
