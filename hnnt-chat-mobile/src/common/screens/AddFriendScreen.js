import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import PhoneInput from 'react-native-phone-number-input';
import AntDesign from '@expo/vector-icons/AntDesign';
const ActionItem = ({ title, onPress, iconName }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.customIcon}>
            <FontAwesome name={iconName} size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
);
export default function AddFriendScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.userQR}>
                <Text>Nguyễn Nga</Text>
                <View></View>
                <Text>Quét mã để thêm bạn Zalo với tôi</Text>
            </View>
            <View style={styles.enterNumberPhoneWrapper}>
                <View style={styles.phoneInputWrapper}>
                    <View>
                        <PhoneInput
                            defaultCode="VN"
                            layout="second"
                            containerStyle={{
                                backgroundColor: '#fff',
                                height: 50,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                padding: 10,
                                alignSelf: 'center',
                            }}
                            textContainerStyle={{
                                backgroundColor: '#f9f9f9',
                                borderRadius: 8,
                            }}
                            textInputStyle={{
                                color: '#333',
                                fontSize: 16,
                            }}
                            codeTextStyle={{
                                color: '#000',
                                fontWeight: 'bold',
                            }}
                            withDarkTheme
                            withShadow
                            autoFocus
                        />
                    </View>
                    <TouchableOpacity style={styles.arrowRightButton}>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    <ActionItem title="Scan QR code" iconName="qrcode" />
                </View>
            </View>
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
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        // alignItems: 'center',
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    arrowRightButton: {
        backgroundColor: '#DEE3E7',
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionWrapper: {
        flex: 1,
        backgroundColor: 'pink',
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
        width: 35,
        height: 35,
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        textAlign: 'center',
    },
    viewSendRequestWrapper: {
        flex: 1,
    },
});
