import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Header({ iconName }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <AntDesign name="search1" size={25} color="white" />
            </TouchableOpacity>
            <TextInput style={styles.searchInput} placeholder="Tìm kiếm" placeholderTextColor="white" />
            <TouchableOpacity>
                <AntDesign name={iconName} size={25} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    searchInput: {
        width: '75%',
        fontSize: 18,
    },
});
