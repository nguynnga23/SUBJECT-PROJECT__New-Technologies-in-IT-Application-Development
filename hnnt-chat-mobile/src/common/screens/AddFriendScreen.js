import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function AddFriendScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.userQR}>
                <Text>Nguyễn Nga</Text>
                <View></View>
                <Text>Quét mã để thêm bạn Zalo với tôi</Text>
            </View>
            <View style={styles.enterNumberPhoneWrapper}></View>
            <View style={styles.actionWrapper}></View>
            <View style={styles.viewSendRequestWrapper}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userQR: {
        flex: 2,
        backgroundColor: 'pink',
    },
    enterNumberPhoneWrapper: {
        flex: 1,
    },
    actionWrapper: {
        flex: 1,
        backgroundColor: 'pink',
    },
    viewSendRequestWrapper: {
        flex: 1,
    },
});
