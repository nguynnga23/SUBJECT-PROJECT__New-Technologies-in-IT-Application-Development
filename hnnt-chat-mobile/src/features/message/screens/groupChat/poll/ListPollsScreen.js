// GroupBoardScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import PollDetail from './PollDetail';
import CreateNewPoll from './CreateNewPoll';
import { getPollsByChat, votePollOption } from '../../../services/GroupChat/poll/PollService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { getUserIdFromToken } from '../../../../../utils/auth';
import { socket } from '../../../../../configs/socket'; // Import socket instance

const ListPollsScreen = () => {
    const [polls, setPolls] = useState([]);
    const route = useRoute();
    const chatId = route.params?.chatId || 'null';
    const [showCreatePoll, setShowCreatePoll] = useState(false);
    const [userId, setUserId] = useState('');
    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userId = getUserIdFromToken(token);
                const fetchedPolls = await getPollsByChat(chatId); // Fetch polls from API
                setUserId(userId);
                setPolls(fetchedPolls);
            } catch (error) {
                alert('Lấy danh sách cuộc thăm dò thất bại');
            }
        };
        fetchPolls();
    }, [chatId]);

    const handleCreatePoll = async (pollData) => {
        setShowCreatePoll(false);
        try {
            const updatedPolls = await getPollsByChat(chatId); // Refresh polls after creation
            setPolls(updatedPolls);

            // Emit socket event to notify about the new poll
            socket.emit('new_poll', { chatId, poll: pollData });
        } catch (error) {
            alert('Cập nhật danh sách cuộc thăm dò thất bại');
        }
    };

    const handleVote = async (chatId, pollId, optionId, voterId) => {
        console.log('Voting parameters:', { chatId, pollId, optionId, voterId });
        try {
            await votePollOption({ chatId, pollId, pollOptionId: optionId, voterId }); // Include voterId
            const updatedPolls = await getPollsByChat(chatId); // Refresh polls after voting
            setPolls(updatedPolls);
        } catch (error) {
            console.error('Error while voting:', error.response?.data || error.message);
            alert(`Bầu chọn thất bại: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Tạo cuộc thăm dò" onPress={() => setShowCreatePoll(true)} />

            {showCreatePoll && <CreateNewPoll chatId={chatId} creatorId={userId} onCreatePoll={handleCreatePoll} />}

            <FlatList
                data={polls}
                renderItem={({ item }) => <PollDetail poll={item} onVote={handleVote} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
});

export default ListPollsScreen;
