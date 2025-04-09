import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import colors from '@/src/constants/colors';
import { useRouter } from 'expo-router';

interface WIPPlaceholderProps {
  title?: string;
  subtitle?: string;
  message?: string;
}

const WIPPlaceholder: React.FC<WIPPlaceholderProps> = ({
  title = 'Work In Progress!',
  subtitle = 'This is a placeholder screen.',
  message = "Replace this with the final feature when it's ready."
}) => {
    const router = useRouter();
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.card, { transform: [{ scale: bounceAnim }] }]}>
                <Text style={styles.title}>{title} <Text style={{ fontSize: 30 }}>🖌️</Text></Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.message}>{message}</Text>

                <TouchableOpacity style={styles.button} onPress={()=>router.navigate('/')}>
                    <Text style={styles.buttonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default WIPPlaceholder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#F9D3E3',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: colors.contentStrong,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.brandPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight:'bold',
    color: colors.contentStrong,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.contentStrong,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
