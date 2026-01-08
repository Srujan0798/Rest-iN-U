import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { useAppStore } from '../store/appStore';
import { showToast } from '../utils/toast';

const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    error: '#ef4444',
    success: '#22c55e',
};

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const setUser = useAppStore((state) => state.setUser);

    const handleRegister = async () => {
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            showToast.error('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 8) {
            showToast.error('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showToast.error('Passwords do not match');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const { user, token } = await api.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            });
            setUser(user, token);
            showToast.success('Account created successfully!');
            navigation.goBack();
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.logoCircle}>
                        <Ionicons name="home" size={40} color={colors.text} />
                    </LinearGradient>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join REST-iN-U today</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name Row */}
                    <View style={styles.row}>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor={colors.textSecondary}
                                value={formData.firstName}
                                onChangeText={(text) => updateField('firstName', text)}
                                autoCapitalize="words"
                                editable={!loading}
                            />
                        </View>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor={colors.textSecondary}
                                value={formData.lastName}
                                onChangeText={(text) => updateField('lastName', text)}
                                autoCapitalize="words"
                                editable={!loading}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.textSecondary}
                            value={formData.email}
                            onChangeText={(text) => updateField('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Phone (Optional) */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone (Optional)"
                            placeholderTextColor={colors.textSecondary}
                            value={formData.phone}
                            onChangeText={(text) => updateField('phone', text)}
                            keyboardType="phone-pad"
                            editable={!loading}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password (min 8 characters)"
                            placeholderTextColor={colors.textSecondary}
                            value={formData.password}
                            onChangeText={(text) => updateField('password', text)}
                            secureTextEntry={!showPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.textSecondary}
                            value={formData.confirmPassword}
                            onChangeText={(text) => updateField('confirmPassword', text)}
                            secureTextEntry={!showConfirmPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
                        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.registerGradient}>
                            {loading ? (
                                <ActivityIndicator color={colors.text} />
                            ) : (
                                <Text style={styles.registerText}>Create Account</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.link}>Terms of Service</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>

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

                    {/* Login Link */}
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 24, paddingTop: 40 },
    header: { alignItems: 'center', marginBottom: 32 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 16 },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    form: {},
    row: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    halfWidth: { flex: 1 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, marginBottom: 14, gap: 10 },
    input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 16 },
    registerBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 6 },
    registerGradient: { padding: 16, alignItems: 'center' },
    registerText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
    terms: { textAlign: 'center', color: colors.textSecondary, fontSize: 12, marginTop: 16, lineHeight: 18 },
    link: { color: colors.primary, fontWeight: '600' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.surface },
    dividerText: { color: colors.textSecondary, fontSize: 13, marginHorizontal: 12 },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
    socialBtn: { width: 50, height: 50, backgroundColor: colors.surface, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    loginText: { color: colors.textSecondary, fontSize: 14 },
    loginLink: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
