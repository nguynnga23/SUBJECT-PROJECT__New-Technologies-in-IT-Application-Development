import { View, TextInput, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
export default function Header({ iconName1, iconName2, onPress1, onPress2, showMenu }) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ paddingRight: 15 }}>
                <AntDesign name="search1" size={25} color="white" />
            </TouchableOpacity>
            <View style={{ width: '55%' }}>
                <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="white" />
            </View>

            {showMenu ? (
                <>
                    <TouchableOpacity style={{ width: '10%', marginLeft: 30 }} onPress={() => navigation.navigate("CameraScreen")}>
                        <MaterialCommunityIcons name={iconName1} size={20} color="white" />
                    </TouchableOpacity>
                    <Menu>
                        <MenuTrigger
                            customStyles={{
                                triggerWrapper: { width: '100%' }, // Kéo trigger xuống
                            }}
                        >
                            <AntDesign name={iconName2} size={26} color="white" />
                        </MenuTrigger>
                        <MenuOptions
                            customStyles={{
                                optionsContainer: styles.menuStyle,
                                anchorStyle: {
                                    top: 100, // Kéo popup xuống
                                },
                            }}
                        >
                            <View style={styles.triangle}></View>
                            <MenuOption onSelect={() => navigation.navigate('Add Friends')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <AntDesign name="adduser" size={20} color="gray" />
                                    <Text style={{ padding: 10 }}>Add Friends</Text>
                                </View>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.navigate('New Group')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <AntDesign name="addusergroup" size={20} color="gray" />
                                    <Text style={{ padding: 10 }}>Create Group</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </>
            ) : (
                <>
                    <TouchableOpacity style={{ width: '10%', marginLeft: 30 }} onPress={onPress2}>
                        <MaterialCommunityIcons name={iconName1} size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '10%' }} onPress={onPress2}>
                        <AntDesign name={iconName2} size={25} color="white" />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        zIndex: 1, // Đảm bảo header hiển thị trên cùng
    },
    triangle: {
        position: 'absolute',
        top: -20, // Đặt trên popup
        right: 0, // Điều chỉnh vị trí
        width: 0,
        height: 0,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 10,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white', // Màu của popup
    },
    menuStyle: {
        borderRadius: 8,
        padding: 10,
        marginTop: 60,
        marginLeft: 0,
        elevation: 100, // Bóng đổ trên Android
        shadowColor: '#000', // Màu bóng trên iOS
        shadowOffset: { width: 0, height: 4 }, // Đổ bóng phía dưới
        shadowOpacity: 0.3, // Độ mờ của bóng
        shadowRadius: 5, // Độ lan tỏa của 0bóng
        zIndex: 1000, // Đảm bảo hiển thị trên top
        position: 'absolute', // Định vị tuyệt đối
        right: 10, // Điều chỉnh vị trí theo chiều ngang
    },
});
