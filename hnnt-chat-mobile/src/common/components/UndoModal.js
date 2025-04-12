import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UndoModal = ({ visible, message, onUndo }) => {
    if (!visible) return null;

    return (
        <View style={styles.undoModal}>
            <Text style={styles.undoMessage}>{message}</Text>
            <TouchableOpacity onPress={onUndo}>
                <Text style={styles.undoButton}>Undo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    undoModal: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    undoMessage: {
        color: '#fff',
        fontSize: 14,
    },
    undoButton: {
        color: '#1E90FF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default UndoModal;
