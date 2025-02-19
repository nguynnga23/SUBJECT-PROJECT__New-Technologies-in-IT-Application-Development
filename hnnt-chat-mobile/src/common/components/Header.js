import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function Header({ iconName1, iconName2, onPress1, onPress2 }) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ width: '20%', marginLeft: '-15' }}>
                <AntDesign name="search1" size={25} color="white" />
            </TouchableOpacity>
            <View style={{ width: '60%' }}>
                <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="white" />
            </View>
            <TouchableOpacity style={{ width: '10%', marginLeft: 30 }} onPress={onPress1}>
                <MaterialCommunityIcons name={iconName1} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '10%' }} onPress={onPress2}>
                <AntDesign name={iconName2} size={25} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
    },
});
