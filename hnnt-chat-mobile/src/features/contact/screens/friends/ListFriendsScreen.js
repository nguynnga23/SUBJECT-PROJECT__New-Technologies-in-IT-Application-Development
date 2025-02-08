import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import iconSet from '@expo/vector-icons/build/Fontisto';

const ActionItem = ({ title, onPress, iconName }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.customIcon}>
            <FontAwesome name={iconName} size={16} color="white" />
        </View>
        <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
);

const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.text, isActive && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
);

const ListContent = ({ text }) => (
    <ScrollView style={styles.listContainer}>
        <Text style={styles.textContent}>{text}</Text>
    </ScrollView>
);

export default function ListFriendsScreen() {
    const [selectedTab, setSelectedTab] = useState('all');
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Action Section */}
            <View style={styles.actionWrapper}>
                <ActionItem
                    title="Friend requests (22)"
                    onPress={() => navigation.navigate('FriendRequest')}
                    iconName="users"
                />
                <ActionItem
                    title="Phonebook"
                    onPress={() => navigation.navigate('PhoneBook')}
                    iconName="address-book"
                />
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TabButton title="All" isActive={selectedTab === 'all'} onPress={() => setSelectedTab('all')} />
                <TabButton
                    title="Recently Online"
                    isActive={selectedTab === 'recently'}
                    onPress={() => setSelectedTab('recently')}
                />
            </View>

            {/* Nội dung tab */}
            <View style={styles.content}>
                <ListContent
                    text={selectedTab === 'all' ? 'Danh sách tất cả bạn bè' : 'Danh sách tất cả bạn bè online'}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Action Section
    actionWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customIcon: {
        backgroundColor: '#007AFF',
        width: 35,
        height: 35,
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Tab Navigation
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tab: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DEE3E7',
        marginRight: 15,
    },
    activeTab: {
        backgroundColor: '#DEE3E7',
    },
    text: {
        color: '#6D6D6D',
    },
    activeText: {
        color: 'black',
    },

    // Nội dung tab
    content: {
        flex: 3,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 2,
        paddingHorizontal: 15,
    },
});
