import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

export default function AddGroupScreen() {
    return (
        <View style={styles.container}>
            <Text>Create a new group</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
