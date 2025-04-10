import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [require('../../../assets/icons/img_HomeScreen.png')];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            // duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            setCurrentIndex(nextIndex);
            scrollRef.current?.scrollTo({ x: nextIndex * 300, animated: true });
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <LinearGradient
                    colors={['#007AFF', '#00C6FF']} // Gradient colors matching the logo
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.titleContainer}
                >
                    <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>HNNT</Animated.Text>
                </LinearGradient>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={styles.slider}
                    contentContainerStyle={styles.sliderContent}
                    snapToInterval={250} // Snap to the width of one image
                    decelerationRate="fast" // Smooth snapping
                >
                    {images.map((image, index) => (
                        <Image key={index} source={image} style={styles.sliderImage} />
                    ))}
                </ScrollView>

                <Text style={styles.descriptionText}>
                    HNNT Chat is your ultimate app for seamless communication and collaboration. Join us today!
                </Text>

                <View style={styles.dotsContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
                        />
                    ))}
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <LinearGradient
                        colors={['#007AFF', '#00C6FF']} // Gradient colors for the login button
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.loginButton}
                    >
                        <Text style={styles.loginText}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <LinearGradient
                        colors={['#E5E5E5', '#CCCCCC']} // Gradient colors for the sign-up button
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.signUpButton}
                    >
                        <Text style={styles.signUpText}>Create new account</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    titleContainer: {
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        fontSize: 40, // Larger font size for emphasis
        fontWeight: 'bold',
        color: '#fff', // Text color to contrast with gradient
        textAlign: 'center',
    },
    slider: {
        marginTop: 20,
        marginBottom: 30,
        maxHeight: 250, // Limit the height of the slider
    },
    sliderContent: {
        alignItems: 'center', // Center the content vertically
        justifyContent: 'center', // Center the content horizontally
        width: '100%',
    },
    sliderImage: {
        width: 200,
        height: 200,
        marginHorizontal: 0, // Remove extra spacing
        borderRadius: 10,
    },
    descriptionText: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 20,
    },
    activeDot: {
        backgroundColor: '#007AFF',
    },
    inactiveDot: {
        backgroundColor: '#E5E5E5',
    },
    loginButton: {
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    signUpText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
