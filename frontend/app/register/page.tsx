'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type UserRole = 'BUYER' | 'SELLER' | 'AGENT';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  // Agent-specific fields
  licenseNumber?: string;
  brokerage?: string;
  specializations?: string[];
  serviceAreas?: string[];
  bio?: string;
  // Buyer preferences
  preferVastu?: boolean;
  preferAstrology?: boolean;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  // Terms
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  subscribeNewsletter: boolean;
}

const specializations = [
  'Residential',
  'Commercial',
  'Luxury',
  'Investment',
  'First-Time Buyers',
  'Relocation',
  'Vastu Properties',
  'Green Homes',
  'Historic Properties',
  'New Construction',
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'BUYER',
    preferVastu: false,
    preferAstrology: false,
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: true,
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError('Password must contain uppercase letter and number');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.role === 'AGENT') {
      if (!formData.licenseNumber?.trim()) {
        setError('License number is required for agents');
        return false;
      }
      if (!formData.brokerage?.trim()) {
        setError('Brokerage name is required');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      setError('Please agree to the terms and privacy policy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and redirect
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        {/* Om Symbol Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="om-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <text x="10" y="15" fontSize="12" textAnchor="middle" fill="currentColor">à¥</text>
            </pattern>
            <rect fill="url(#om-pattern)" width="100" height="100" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 p-12 flex-col justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">ðŸ›ï¸</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dharma Realty</h1>
                <p className="text-white/80 text-sm">Sacred Spaces, Modern Living</p>
              </div>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Begin Your Journey to<br />
                <span className="text-yellow-200">Harmonious Living</span>
              </h2>
              <p className="mt-4 text-white/90 text-lg">
                Join thousands of families who have found their perfect home aligned with 
                ancient wisdom and modern convenience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'ðŸ ', label: 'Vastu-Compliant Homes', value: '50,000+' },
                { icon: 'â­', label: 'Happy Families', value: '25,000+' },
                { icon: 'ðŸŒŸ', label: 'Verified Agents', value: '1,000+' },
                { icon: 'ðŸ“', label: 'Cities Covered', value: '100+' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-sm">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-white/90">
              <span className="font-semibold">1,000+</span> new members this month
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="mx-auto w-full max-w-lg">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">ðŸ›ï¸</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Dharma Realty</span>
              </Link>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        s === step
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-110'
                          : s < step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {s < step ? 'âœ“' : s}
                    </div>
                    {s < 4 && (
                      <div className={`w-16 lg:w-24 h-1 mx-2 rounded ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Account</span>
                <span>Personal</span>
                <span>Role</span>
                <span>Confirm</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 1: Account Details */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                      <p className="mt-1 text-gray-600">Enter your email and create a secure password</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => updateField('email', e.target.value)}
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder="you@example.com"
                          />
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={e => updateField('password', e.target.value)}
                            className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                          />
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                              {[0, 1, 2, 3, 4].map(i => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded ${
                                    i < getPasswordStrength() ? strengthColors[getPasswordStrength() - 1] : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              Password strength: <span className={`font-medium ${getPasswordStrength() >= 4 ? 'text-green-600' : 'text-gray-600'}`}>
                                {strengthLabels[getPasswordStrength() - 1] || 'Too weak'}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={e => updateField('confirmPassword', e.target.value)}
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                          />
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Passwords match
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <p className="mt-1 text-gray-600">Tell us a bit about yourself</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => updateField('firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => updateField('lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => updateField('phone', e.target.value)}
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="+91 98765 43210"
                          />
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-3">Would you like astrological guidance?</p>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-orange-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.preferVastu}
                              onChange={e => updateField('preferVastu', e.target.checked)}
                              className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <div>
                              <p className="font-medium text-gray-900">Vastu Shastra Analysis</p>
                              <p className="text-sm text-gray-500">Get properties aligned with Vastu principles</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-orange-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.preferAstrology}
                              onChange={e => updateField('preferAstrology', e.target.checked)}
                              className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <div>
                              <p className="font-medium text-gray-900">Jyotish Compatibility</p>
                              <p className="text-sm text-gray-500">Find auspicious times for property decisions</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {formData.preferAstrology && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 pt-4 border-t"
                        >
                          <p className="text-sm text-gray-600">
                            For accurate astrological guidance, please provide your birth details:
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                              <input
                                type="date"
                                value={formData.birthDate}
                                onChange={e => updateField('birthDate', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                              <input
                                type="time"
                                value={formData.birthTime}
                                onChange={e => updateField('birthTime', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                            <input
                              type="text"
                              value={formData.birthPlace}
                              onChange={e => updateField('birthPlace', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="City, State, Country"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Role Selection */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">How will you use Dharma Realty?</h2>
                      <p className="mt-1 text-gray-600">Select your primary role</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { value: 'BUYER', icon: 'ðŸ ', title: 'I want to buy a property', desc: 'Search and purchase your dream home' },
                        { value: 'SELLER', icon: 'ðŸ’°', title: 'I want to sell a property', desc: 'List and sell your property' },
                        { value: 'AGENT', icon: 'ðŸ‘”', title: "I'm a real estate agent", desc: 'Connect with buyers and sellers' },
                      ].map(role => (
                        <label
                          key={role.value}
                          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.role === role.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={e => updateField('role', e.target.value as UserRole)}
                            className="sr-only"
                          />
                          <span className="text-3xl">{role.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{role.title}</p>
                            <p className="text-sm text-gray-500">{role.desc}</p>
                          </div>
                          {formData.role === role.value && (
                            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </label>
                      ))}
                    </div>

                    {formData.role === 'AGENT' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                          <input
                            type="text"
                            value={formData.licenseNumber || ''}
                            onChange={e => updateField('licenseNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="RERA License Number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Brokerage Name *</label>
                          <input
                            type="text"
                            value={formData.brokerage || ''}
                            onChange={e => updateField('brokerage', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Your brokerage or company"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                          <div className="flex flex-wrap gap-2">
                            {specializations.map(spec => (
                              <button
                                key={spec}
                                type="button"
                                onClick={() => {
                                  const current = formData.specializations || [];
                                  if (current.includes(spec)) {
                                    updateField('specializations', current.filter(s => s !== spec));
                                  } else {
                                    updateField('specializations', [...current, spec]);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                  formData.specializations?.includes(spec)
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {spec}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                          <textarea
                            value={formData.bio || ''}
                            onChange={e => updateField('bio', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Tell potential clients about yourself..."
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Almost there!</h2>
                      <p className="mt-1 text-gray-600">Review your information and confirm</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role</span>
                        <span className="font-medium capitalize">{formData.role.toLowerCase()}</span>
                      </div>
                      {formData.preferVastu && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vastu Analysis</span>
                          <span className="text-green-600">âœ“ Enabled</span>
                        </div>
                      )}
                      {formData.preferAstrology && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jyotish Compatibility</span>
                          <span className="text-green-600">âœ“ Enabled</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={e => updateField('agreeToTerms', e.target.checked)}
                          className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeToPrivacy}
                          onChange={e => updateField('agreeToPrivacy', e.target.checked)}
                          className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.subscribeNewsletter}
                          onChange={e => updateField('subscribeNewsletter', e.target.checked)}
                          className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                          Send me property alerts and newsletters (optional)
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>

            {/* Social Sign Up */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
