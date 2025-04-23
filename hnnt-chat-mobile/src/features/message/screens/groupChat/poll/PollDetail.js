import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns'; // Để định dạng thời gian
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../../utils/auth';
const PollDetail = ({ poll, onVote }) => {
    const { title, creatorId, createdAt, endsAt, options, chatId } = poll;
    // console.log(options);
    const [selectedOption, setSelectedOption] = useState(null);

    // Tính tổng số phiếu bầu
    // const totalVotes = options.reduce((sum, option) => sum + option.votes.length, 0);

    // Kiểm tra xem poll đã kết thúc chưa
    const hasEnded = !!endsAt && new Date(endsAt) < new Date();

    const handleVote = async (optionId) => {
        console.log('Option selected for voting:', optionId);
        if (!hasEnded && !selectedOption) {
            setSelectedOption(optionId);
            try {
                const token = await AsyncStorage.getItem('token');
                const voterId = getUserIdFromToken(token); // Extract voterId from token
                await onVote(chatId, poll.id, optionId, voterId); // Pass voterId
            } catch (error) {
                console.error('Error while voting:', error.response?.data || error.message);
                alert(`Bầu chọn thất bại: ${error.response?.data?.error || error.message}`);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Image source={{ uri: creator.avt || 'default_avatar_url' }} style={styles.avatar} /> */}
                <View>
                    {/* <Text style={styles.creator}>{creator.name} đã tạo một cuộc thăm dò</Text> */}
                    <Text style={styles.time}>{formatDistanceToNow(new Date(createdAt))} trước</Text>
                </View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.status}>
                {hasEnded ? `Kết thúc lúc ${new Date(endsAt).toLocaleString()}` : 'Đang diễn ra'}
            </Text>
            {/* <Text style={styles.votes}>{totalVotes} thành viên đã bầu</Text> */}

            {/* Hiển thị các lựa chọn */}
            {options.map((option) => {
                // const voteCount = option.votes.length;
                // const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

                return (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.option, selectedOption === option.id && styles.selectedOption]}
                        onPress={() => handleVote(option.id)}
                        disabled={!!hasEnded || !!selectedOption}
                    >
                        <Text style={styles.optionText}>{option.text}</Text>
                        {/* <Text style={styles.voteCount}>{voteCount}</Text> */}
                        {/* <View style={[styles.progressBar, { width: `${percentage}%` }]} /> */}
                    </TouchableOpacity>
                );
            })}

            <TouchableOpacity style={styles.viewPollButton}>
                <Text style={styles.viewPollText}>Xem cuộc thăm dò</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
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
        marginVertical: 10,
    },
    status: {
        color: '#888',
        fontSize: 14,
    },
    votes: {
        color: '#1e90ff',
        fontSize: 14,
        marginBottom: 10,
    },
    option: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#d3eaff',
    },
    optionText: {
        flex: 1,
        fontSize: 16,
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
