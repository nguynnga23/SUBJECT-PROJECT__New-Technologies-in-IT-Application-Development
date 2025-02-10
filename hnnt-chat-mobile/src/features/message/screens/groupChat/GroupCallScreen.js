import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function GroupCallScreen() {
    const navigation = useNavigation();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    return (
        <View style={styles.container}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            {/* Avatar & Tên Nhóm gọi */}
            <View style={styles.profileContainer}>
                <Image
                    source={require("../../../../assets/icon.png")}
                    style={styles.avatar}
                />
                <Text style={styles.name}>...</Text>
                <Text style={styles.status}>Connection</Text>
            </View>

            {/* Các nút chức năng */}
            <View style={styles.buttonContainer}>
                {/* Nút Camera */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsCameraOn(!isCameraOn)}
                >
                    <Ionicons name={isCameraOn ? "videocam" : "videocam-off"} size={30} color="white" />
                    <Text style={styles.buttonText}>{isCameraOn ? "Camera on" : "Camera off"}</Text>
                </TouchableOpacity>

                {/* Nút Mic */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsMicOn(!isMicOn)}
                >
                    <Ionicons name={isMicOn ? "mic" : "mic-off"} size={30} color="white" />
                    <Text style={styles.buttonText}>{isMicOn ? "Mic on" : "Mic off"}</Text>
                </TouchableOpacity>

                {/* Nút Kết Thúc Cuộc Gọi */}
                <TouchableOpacity style={[styles.button, styles.endCallButton]}>
                    <Ionicons name="call" size={30} color="white" />
                    <Text style={styles.buttonText}>End</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
