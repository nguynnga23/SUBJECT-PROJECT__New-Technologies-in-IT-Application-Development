import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatInputContainer({
    message,
    setMessage,
    onSendMessage,
    onSendFile,
    onSendImage,
    onOpenEmojiPicker,
    onOpenVoiceRecorder,
}) {
    return (
        <View style={styles.inputContainer}>
            {/* <TouchableOpacity onPress={onOpenEmojiPicker} style={styles.iconButton}>
                <Ionicons name="happy-outline" size={24} color="gray" />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onSendImage} style={styles.iconButton}>
                <Ionicons name="image-outline" size={24} color="gray" />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Message" value={message} onChangeText={setMessage} />
            {!message && (
                <>
                    <TouchableOpacity onPress={onSendFile} style={styles.iconButton}>
                        <Ionicons name="document-outline" size={24} color="gray" />
                    </TouchableOpacity>
                </>
            )}
            <TouchableOpacity
                onPress={() => {
                    if (message) {
                        onSendMessage(message);
                        setMessage('');
                    } else {
                        onOpenVoiceRecorder();
                    }
                }}
                style={styles.iconButton}
            >
                <Ionicons
                    name={message ? 'send-outline' : 'mic-outline'}
                    size={24}
                    color={message ? '#007AFF' : 'gray'}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        height: 40,
        marginHorizontal: 10,
        fontSize: 16,
    },
    iconButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
