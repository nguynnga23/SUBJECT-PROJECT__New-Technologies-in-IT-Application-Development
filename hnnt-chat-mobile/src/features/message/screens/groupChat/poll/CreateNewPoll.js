// CreatePoll.js
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '../../../../../configs/socket';
import { View, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { createPoll } from '../../../services/GroupChat/poll/PollService';
import { sendMessage } from '../../../services/ChatService';
const CreateNewPoll = ({ chatId, creatorId, onCreatePoll }) => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']); // Bắt đầu với 2 lựa chọn trống
    const [endsAt, setEndsAt] = useState(null); // Tùy chọn: Thêm chọn ngày kết thúc
    const [token, setToken] = useState(null);
    const addOption = () => {
        setOptions([...options, '']);
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleCreate = async () => {
        const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
        setToken(token); // Lưu token vào state

        if (!token) {
            Alert.alert('Error', 'You are not logged in!');
            return;
        }
        if (!title || options.some((opt) => !opt)) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const pollData = {
            chatId,
            creatorId,
            title,
            options: options.map((text) => ({ text })),
            endsAt,
        };

        try {
            const data = await createPoll(pollData); // Call the API to create the poll
            onCreatePoll(pollData); // Notify parent component
            if (data) {
                const sendMess = await sendMessage(data?.chatId, data?.id, 'poll', null, null, null, null, token);
                socket.emit('send_message', {
                    chatId: data?.chatId,
                    newMessage: sendMess,
                });
            }
        } catch (error) {
            alert('Tạo cuộc thăm dò thất bại');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Tiêu đề cuộc thăm dò" value={title} onChangeText={setTitle} />

            <FlatList
                data={options}
                renderItem={({ item, index }) => (
                    <TextInput
                        style={styles.input}
                        placeholder={`Lựa chọn ${index + 1}`}
                        value={item}
                        onChangeText={(text) => updateOption(index, text)}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <TouchableOpacity style={styles.addButton} onPress={addOption}>
                <Text style={styles.addButtonText}>Thêm lựa chọn</Text>
            </TouchableOpacity>

            <Button title="Tạo cuộc thăm dò" onPress={handleCreate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    addButton: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#1e90ff',
        borderRadius: 5,
        marginVertical: 10,
    },
    addButtonText: {
        color: '#fff',
    },
});

export default CreateNewPoll;
