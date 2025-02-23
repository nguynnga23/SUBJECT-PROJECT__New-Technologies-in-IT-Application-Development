import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';

export default function EditPersonalInformation({ navigation }) {
    const initialFormData = {
        avatar: 'https://i.pravatar.cc/150?img=20',
        zaloName: 'Nguyễn Nga',
        birthday: '01/01/2000',
        gender: 'Female',
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        ImagePicker.requestMediaLibraryPermissionsAsync();
    }, []);

    useEffect(() => {
        setIsChanged(
            selectedImage !== null ||
                formData.zaloName !== initialFormData.zaloName ||
                formData.birthday !== initialFormData.birthday ||
                formData.gender !== initialFormData.gender,
        );
    }, [formData, selectedImage]);

    const pickImage = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        if (!isChanged) return;
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.inforWrapper}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    <Image source={{ uri: selectedImage || formData.avatar }} style={styles.avatar} />
                </TouchableOpacity>

                <View>
                    <InfoInput
                        title="Zalo Name"
                        value={formData.zaloName}
                        onChangeText={(text) => handleChange('zaloName', text)}
                    />
                    <InfoInput
                        title="Birthday"
                        value={formData.birthday}
                        onChangeText={(text) => handleChange('birthday', text)}
                    />
                    <InfoInput
                        title="Gender"
                        value={formData.gender}
                        isRadio
                        onSelect={(selectedGender) => handleChange('gender', selectedGender)}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.saveButton, !isChanged && styles.disabledButton]}
                onPress={handleSave}
                disabled={!isChanged}
            >
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const InfoInput = ({ title, value, onChangeText, isRadio, onSelect }) => {
    const radioOptions = useMemo(() => ['Male', 'Female'], []);

    return (
        <View style={styles.inputContainer}>
            {isRadio ? (
                <RadioButton.Group onValueChange={onSelect} value={value}>
                    <View style={styles.radioGroup}>
                        {radioOptions.map((option) => (
                            <View key={option} style={styles.radioButton}>
                                <RadioButton value={option} />
                                <Text style={styles.radioText}>{option}</Text>
                            </View>
                        ))}
                    </View>
                </RadioButton.Group>
            ) : (
                <TextInput style={styles.input} placeholder={title} value={value} onChangeText={onChangeText} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    inforWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
        alignSelf: 'center',
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 60,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: '#aaa',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    input: {
        width: '75%',
        fontSize: 16,
        color: '#333',
    },
    radioGroup: {
        flexDirection: 'row',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    radioText: {
        marginLeft: 5,
    },
    saveButton: {
        backgroundColor: '#396AA5',
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
