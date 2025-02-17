import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export default function AddGroupScreen() {
    const [selectedImage, setSelectedImage] = useState(null);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log(imageUri);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Group Screen</Text>

            {/* Nút chọn ảnh từ thư viện */}
            <Button title="Chọn ảnh từ thư viện" onPress={openImagePicker} />

            {/* Nút mở camera */}
            <Button title="Chụp ảnh" onPress={handleCameraLaunch} />

            {/* Hiển thị ảnh đã chọn */}
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 20,
    },
});
