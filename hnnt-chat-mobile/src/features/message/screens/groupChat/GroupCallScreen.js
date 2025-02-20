import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function GroupCallScreen() {
    const navigation = useNavigation();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Nút quay lại */}
                <View style={styles.header}>
                    <TouchableOpacity style={{ paddingRight: 20, paddingLeft: 10 }} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.name}>Receiver</Text>
                </View>

                <View style={styles.profileWrapper}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={require("../../../../assets/icon.png")}
                            style={styles.avatar}
                        />
                        <Text style={styles.status}>Connection</Text>
                    </View>

                    {/* Camera của người gọi */}
                    <View style={styles.selfVideoContainer}>
                        <Text style={styles.videoText}>Your Camera</Text>
                    </View>
                </View>

                <View style={styles.videoContainer}>
                    <Text style={styles.videoText}>Video from receiver</Text>
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
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 10,
    },
    profileWrapper: {
        flexDirection: "row", // Hiển thị ngang
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center",
        marginTop: 20,
    },
    profileContainer: {
        marginTop: 20,
        marginLeft: 30,
        alignItems: "center",
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
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
    },
    status: {
        color: "gray",
        fontSize: 16,
        marginTop: 5,
    },
    selfVideoContainer: {
        width: 160,
        height: 160,
        marginRight: 20,
        backgroundColor: "#444",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    videoContainer: {
        marginTop: 20,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        height: 350,
        backgroundColor: "#222",
        borderRadius: 15,
    },
    videoText: {
        color: "white",
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 50,
        justifyContent: "space-evenly",
        width: "100%",
    },
    button: {
        width: 90,
        height: 90,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    endCallButton: {
        backgroundColor: "red",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        marginTop: 2,
    },
});
