import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function ChatInputContainer({
    blocked,
    message,
    setMessage,
    onSendMessage,
    onSendFile,
    onSendImage,
    onSendVoiceMessage,
}) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState(null);
    const [modalRecordVisible, setModalRecordVisible] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [waveformData, setWaveformData] = useState([]);

    useEffect(() => {
        let timer;
        if (isRecording) {
            timer = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
                generateWaveform(); // Simulate waveform data
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRecording]);

    const generateWaveform = () => {
        // Simulate waveform data (random values for visualization)
        setWaveformData((prev) => [...prev.slice(-20), Math.random() * 100]);
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
                const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                setIsRecording(true);
                setRecordingUri(recording);
                setRecordingDuration(0); // Reset duration
                setWaveformData([]); // Reset waveform
            } else {
                alert('Permission to access microphone is required!');
            }
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const stopRecording = async () => {
        try {
            if (recordingUri) {
                await recordingUri.stopAndUnloadAsync();
                const uri = recordingUri.getURI();
                setRecordingUri(uri);
                setIsRecording(false);
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    const handleSendVoiceMessage = () => {
        if (recordingUri) {
            onSendVoiceMessage(recordingUri);
            setRecordingUri(null);
            setModalRecordVisible(false);
        }
    };

    return (
        <View style={styles.inputContainer}>
            {blocked ? (
                <Text style={styles.blockedText}>Blocked</Text>
            ) : (<>
                <TouchableOpacity onPress={onSendImage} style={styles.iconButton}>
                    <Ionicons name="image-outline" size={24} color="gray" />
                </TouchableOpacity>
                <TextInput style={styles.input} placeholder="Message" value={message} onChangeText={setMessage} />
                {!message && (
                    <TouchableOpacity onPress={onSendFile} style={styles.iconButton}>
                        <Ionicons name="document-outline" size={24} color="gray" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => {
                        if (message) {
                            onSendMessage(message);
                            setMessage('');
                        } else {
                            setModalRecordVisible(true);
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
            </>
            )}

            {/* Voice Recording Modal */}
            <Modal animationType="slide" transparent={true} visible={modalRecordVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalRecordContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalRecordVisible(false)}>
                            <Ionicons name="close-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.modalRecordTitle}>Voice Recorder</Text>
                        {isRecording && (
                            <>
                                <Text style={styles.recordingText}>Recording... {recordingDuration}s</Text>
                                <View style={styles.waveformContainer}>
                                    {waveformData.map((value, index) => (
                                        <View key={index} style={[styles.waveformBar, { height: value }]} />
                                    ))}
                                </View>
                            </>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, isRecording && styles.disabledButton]}
                                onPress={startRecording}
                                disabled={isRecording}
                            >
                                <Ionicons name="mic-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, !isRecording && styles.disabledButton]}
                                onPress={stopRecording}
                                disabled={!isRecording}
                            >
                                <Ionicons name="stop-circle-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, !recordingUri && styles.disabledButton]}
                                onPress={handleSendVoiceMessage}
                                disabled={!recordingUri}
                            >
                                <Ionicons name="send-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalRecordContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    recordingText: {
        fontSize: 16,
        color: 'red',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginVertical: 10,
        height: 50,
        width: '100%',
        overflow: 'hidden',
    },
    waveformBar: {
        width: 3,
        marginHorizontal: 1,
        backgroundColor: '#007AFF',
    },
    blockedText: {
        flex: 1,
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});
