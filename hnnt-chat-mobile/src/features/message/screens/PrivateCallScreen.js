import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const PrivateCallScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            {/* Avatar & Tên người gọi */}
            <View style={styles.profileContainer}>
                <Image
                    source={require("../../../assets/icon.png")}
                    style={styles.avatar}
                />
                <Text style={styles.name}>...</Text>
                <Text style={styles.status}>Đang nối máy đến người nhận</Text>
            </View>

            {/* Các nút chức năng */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="videocam" size={30} color="white" />
                    <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Ionicons name="mic" size={30} color="white" />
                    <Text style={styles.buttonText}>Mic</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.endCallButton]}>
                    <Ionicons name="call" size={30} color="white" />
                    <Text style={styles.buttonText}>Kết thúc</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PrivateCallScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 100,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "white",
    },
    name: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 10,
    },
    status: {
        color: "gray",
        fontSize: 16,
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 50,
        justifyContent: "space-evenly",
        width: "100%",
    },
    button: {
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 50,
    },
    endCallButton: {
        backgroundColor: "red",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
    },
});
