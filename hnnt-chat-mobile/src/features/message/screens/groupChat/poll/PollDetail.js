import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper'; // Import RadioButton component
import { formatDistanceToNow } from 'date-fns'; // Để định dạng thời gian
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../../utils/auth';

const PollDetail = ({ poll, onVote }) => {
    const { title, creatorId, createdAt, endsAt, options, chatId } = poll;
    const [selectedOption, setSelectedOption] = useState(null);
    const [userHasVoted, setUserHasVoted] = useState(false);

    useEffect(() => {
        const checkIfUserHasVoted = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const voterId = getUserIdFromToken(token);
                const votedOption = options.find((option) => option.votes.some((vote) => vote.voterId === voterId));
                if (votedOption) {
                    setSelectedOption(votedOption.id); // Set the selected option to the one the user voted for
                    setUserHasVoted(true);
                }
            } catch (error) {
                console.error('Error checking if user has voted:', error);
            }
        };
        checkIfUserHasVoted();
    }, [options]);

    // Tính tổng số phiếu bầu
    const totalVotes = options.reduce((sum, option) => sum + option.votes.length, 0);

    // Kiểm tra xem poll đã kết thúc chưa
    const hasEnded = !!endsAt && new Date(endsAt) < new Date();

    const handleVote = async () => {
        if (!hasEnded && selectedOption && !userHasVoted) {
            try {
                const token = await AsyncStorage.getItem('token');
                const voterId = getUserIdFromToken(token); // Extract voterId from token
                await onVote(chatId, poll.id, selectedOption, voterId); // Pass voterId
                setUserHasVoted(true); // Mark user as having voted
            } catch (error) {
                console.error('Error while voting:', error.response?.data || error.message);
                alert(`Voting failed: ${error.response?.data?.error || error.message}`);
            }
        } else if (userHasVoted) {
            alert('You have already voted in this poll.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Image source={{ uri: creator.avt || 'default_avatar_url' }} style={styles.avatar} /> */}
                <View>{/* <Text style={styles.creator}>{creator.name} đã tạo một cuộc thăm dò</Text> */}</View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.time}>{formatDistanceToNow(new Date(createdAt))} ago</Text>
            {/* <Text style={styles.status}>{hasEnded ? `Ended at ${new Date(endsAt).toLocaleString()}` : 'Ongoing'}</Text> */}
            <Text style={styles.votes}>{totalVotes} members have voted</Text>

            {/* Hiển thị các lựa chọn */}
            {options.map((option) => {
                const voteCount = option.votes.length;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isSelected = selectedOption === option.id;

                return (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.option, isSelected && styles.selectedOption]}
                        onPress={() => setSelectedOption(option.id)}
                        disabled={!!hasEnded || userHasVoted}
                    >
                        <View style={styles.radioButton}>{isSelected && <View style={styles.radioButtonInner} />}</View>
                        <Text style={styles.optionText}>{option.text}</Text>
                        <Text style={styles.voteCount}>{voteCount}</Text>
                        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                    </TouchableOpacity>
                );
            })}

            <TouchableOpacity
                style={[styles.voteButton, (userHasVoted || hasEnded || !selectedOption) && styles.disabledVoteButton]}
                onPress={handleVote}
                disabled={!!hasEnded || !selectedOption || userHasVoted}
            >
                <Text style={styles.voteButtonText}>Vote</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.viewPollButton}>
                <Text style={styles.viewPollText}>View Poll</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    creator: {
        fontWeight: 'bold',
    },
    time: {
        color: '#888',
        fontSize: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    status: {
        color: '#888',
        fontSize: 14,
    },
    votes: {
        color: '#1e90ff',
        fontSize: 14,
        marginVertical: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
    },
    selectedOption: {
        backgroundColor: '#e6f7ff',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#1e90ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 6,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 20,
    },
    voteCount: {
        fontSize: 16,
        marginRight: 10,
    },
    progressBar: {
        height: 5,
        backgroundColor: '#1e90ff',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    voteButton: {
        padding: 10,
        backgroundColor: '#1e90ff',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledVoteButton: {
        backgroundColor: '#d3d3d3', // Gray color for disabled state
    },
    voteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    viewPollButton: {
        padding: 10,
        alignItems: 'center',
    },
    viewPollText: {
        color: '#1e90ff',
        fontSize: 16,
    },
});

export default PollDetail;
