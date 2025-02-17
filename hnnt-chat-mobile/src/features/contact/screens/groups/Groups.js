import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

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

export default function Groups() {
    const [selectedTab, setSelectedTab] = useState('all');
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Action Section */}
            <View style={styles.actionWrapper}>
                <ActionItem title="Create Group" onPress={() => navigation.navigate('AddGroup')} iconName="users" />
            </View>

            {/* Nội dung tab */}
            <View style={styles.content}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View>
                        <Text>Joined Groups (50)</Text>
                    </View>
                    <TouchableOpacity>
                        <Text>Recent activity</Text>
                    </TouchableOpacity>
                </View>
                <View></View>
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

    // Nội dung tab
    content: {
        flex: 7,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 2,
        paddingHorizontal: 15,
    },
});
