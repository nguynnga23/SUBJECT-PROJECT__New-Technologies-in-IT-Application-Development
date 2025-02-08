import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Header({ iconName1, iconName2 }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <AntDesign name="search1" size={25} color="white" />
            </TouchableOpacity>
            <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="white" />
            <TouchableOpacity>
                <MaterialCommunityIcons name={iconName1} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
                <AntDesign name={iconName2} size={25} color="white" />
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
