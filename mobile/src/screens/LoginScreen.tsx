import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    error: '#ef4444',
};

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        // TODO: Implement actual login
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* Logo */}
            <View style={styles.header}>
                <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.logoCircle}>
                    <Ionicons name="home" size={40} color={colors.text} />
                </LinearGradient>
                <Text style={styles.title}>REST-iN-U</Text>
                <Text style={styles.subtitle}>AI-Powered Ayurvedic Real Estate</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.loginGradient}>
                        <Text style={styles.loginText}>Sign In</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login */}
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-google" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-apple" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-facebook" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Register */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.registerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 16 },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    form: {},
    error: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, marginBottom: 14, gap: 10 },
    input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 16 },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotText: { color: colors.primary, fontSize: 13 },
    loginBtn: { borderRadius: 12, overflow: 'hidden' },
    loginGradient: { padding: 16, alignItems: 'center' },
    loginText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.surface },
    dividerText: { color: colors.textSecondary, fontSize: 13, marginHorizontal: 12 },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
    socialBtn: { width: 50, height: 50, backgroundColor: colors.surface, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    registerText: { color: colors.textSecondary, fontSize: 14 },
    registerLink: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});

