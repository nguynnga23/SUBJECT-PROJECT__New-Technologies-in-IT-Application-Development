import React, { useState, useEffect, useMemo } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileService from '../../services/ProfileService';
import { format } from 'date-fns'; // Import thư viện date-fns

export default function EditPersonalInformation({ navigation }) {
    const [user, setUser] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        avatar: '',
        name: '',
        birthday: '',
        gender: 'Female',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const fetchUserFromStorage = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (!userJson) throw new Error('User not found in storage');

                const userData = JSON.parse(userJson);
                setUser(userData);
            } catch (error) {
                console.error('Lỗi lấy user từ AsyncStorage:', error);
            }
        };

        fetchUserFromStorage();
    }, []);
    const formattedBirthDate = user?.birthDate
        ? format(new Date(user.birthDate), 'dd/MM/yyyy') // Format as dd/MM/yyyy
        : 'Chưa cập nhật';
    const initialFormData = useMemo(
        () => ({
            avatar: user?.avatar || 'https://i.pravatar.cc/150?img=20',
            name: user?.name || '',
            birthday: formattedBirthDate || '',
            gender: user?.gender || 'Female',
        }),
        [user],
    );

    useEffect(() => {
        if (user) {
            setFormData(initialFormData);
        }
    }, [user, initialFormData]);

    useEffect(() => {
        ImagePicker.requestMediaLibraryPermissionsAsync();
    }, []);

    useEffect(() => {
        setIsChanged(
            selectedImage !== null ||
                formData.name !== initialFormData.name ||
                formData.birthday !== initialFormData.birthday ||
                formData.gender !== initialFormData.gender,
        );
    }, [formData, selectedImage, initialFormData]);

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

    const handleSave = async () => {
        if (!isChanged) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            // Upload avatar if a new image is selected
            if (selectedImage) {
                const updatedAvatar = await ProfileService.updateAvatar(token, selectedImage);
                formData.avatar = updatedAvatar.avatar; // Update avatar URL in formData
            }
            console.log(selectedImage);
            const parsedBirthday = formData.birthday
                ? new Date(formData.birthday.split('/').reverse().join('-')) // Parse dd/MM/yyyy to yyyy-MM-dd
                : null;

            const updatedUser = {
                name: formData.name,
                gender: formData.gender,
                birthDate: parsedBirthday ? parsedBirthday.toISOString() : null,
            };

            const response = await ProfileService.updateProfile(token, updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(response));
            setUser(response);
            navigation.goBack(); // Navigate back to ProfileScreen
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(false);
            }}
        >
            <View style={styles.container}>
                <View style={styles.inforWrapper}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: selectedImage || formData.avatar || 'https://i.pravatar.cc/150?img=20', // Fallback URL
                            }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>

                    <View>
                        <InfoInput
                            title="Zalo Name"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>{formData.birthday || 'Select Birthday'}</Text>
                        </TouchableOpacity>
                        <InfoInput
                            title="Gender"
                            value={formData.gender}
                            isRadio
                            onSelect={(selectedGender) => handleChange('gender', selectedGender)}
                        />
                    </View>
                </View>

                {showDatePicker && (
                    <View style={styles.footerDatePicker}>
                        <DateTimePicker
                            value={
                                formData.birthday
                                    ? new Date(formData.birthday.split('/').reverse().join('-'))
                                    : new Date()
                            } // Parse dd/MM/yyyy to yyyy-MM-dd
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    const formattedDate = format(selectedDate, 'dd/MM/yyyy'); // Format as dd/MM/yyyy
                                    handleChange('birthday', formattedDate);
                                }
                            }}
                        />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.saveButton, !isChanged && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={!isChanged}
                >
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const InfoInput = ({ title, value, onChangeText, isRadio, onSelect }) => {
    const radioOptions = useMemo(() => ['Male', 'Female'], []);

    return (
        <View style={styles.inputContainer}>
            {isRadio ? (
                <RadioButton.Group onValueChange={onSelect} value={value || formData.gender}>
                    <View style={styles.radioGroup}>
                        {radioOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.radioButtonContainer}
                                onPress={() => onSelect(option)}
                            >
                                <View style={[styles.radioOuterCircle, value === option && styles.radioSelected]}>
                                    {value === option && <View style={styles.radioInnerCircle} />}
                                </View>
                                <Text style={styles.radioText}>{option}</Text>
                            </TouchableOpacity>
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
        marginVertical: 5,
    },
    input: {
        width: '75%',
        fontSize: 16,
        color: '#333',
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    radioOuterCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#396AA5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInnerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#396AA5',
    },
    radioSelected: {
        borderColor: '#396AA5',
    },
    radioText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#396AA5',
        paddingVertical: 10,
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
    datePickerButton: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    footerDatePicker: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
