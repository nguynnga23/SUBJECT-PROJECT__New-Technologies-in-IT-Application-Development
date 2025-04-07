import React from "react";
import { View, Text } from "react-native";
import { RNCamera } from "react-native-camera";

const CameraScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <RNCamera
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back} // Dùng camera sau
                captureAudio={false} // Không cần ghi âm
            />
            <Text style={{ position: "absolute", top: 50, left: 20, color: "white" }}>Camera bật!</Text>
        </View>
    );
};

export default CameraScreen;
