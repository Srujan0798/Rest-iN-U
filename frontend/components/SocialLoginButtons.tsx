'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

interface SocialLoginButtonsProps {
    onSuccess?: (provider: string, user: any) => void;
    onError?: (error: string) => void;
}

export default function SocialLoginButtons({ onSuccess, onError }: SocialLoginButtonsProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading('google');
        try {
            // Initialize Google Sign-In
            // In production, use @react-oauth/google or Google Identity Services
            const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

            if (!googleClientId) {
                throw new Error('Google Client ID not configured');
            }

            // Simulated Google login for demo
            // In production, this would open Google's OAuth popup
            const mockCredential = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';

            const response = await fetch('/api/auth/oauth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: mockCredential }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Google login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            onSuccess?.('google', data.user);
        } catch (error: any) {
            onError?.(error.message || 'Google login failed');
        } finally {
            setLoading(null);
        }
    };

    const handleFacebookLogin = async () => {
        setLoading('facebook');
        try {
            // Initialize Facebook SDK
            // In production, use react-facebook-login or Facebook SDK
            const fbAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

            if (!fbAppId) {
                throw new Error('Facebook App ID not configured');
            }

            // Simulated Facebook login
            const mockAccessToken = 'EAABsb...';
            const mockUserId = '123456789';

            const response = await fetch('/api/auth/oauth/facebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: mockAccessToken, userId: mockUserId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Facebook login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            onSuccess?.('facebook', data.user);
        } catch (error: any) {
            onError?.(error.message || 'Facebook login failed');
        } finally {
            setLoading(null);
        }
    };

    const handleAppleLogin = async () => {
        setLoading('apple');
        try {
            // In production, use Sign in with Apple JS
            // This requires Apple Developer account and proper setup

            const mockIdentityToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';
            const mockAuthCode = 'c123...';

            const response = await fetch('/api/auth/oauth/apple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identityToken: mockIdentityToken,
                    authorizationCode: mockAuthCode,
                    user: {
                        email: 'user@example.com',
                        name: { firstName: 'John', lastName: 'Doe' }
                    }
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Apple login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            onSuccess?.('apple', data.user);
        } catch (error: any) {
            onError?.(error.message || 'Apple login failed');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="social-login-buttons">
            <div className="divider">
                <span>or continue with</span>
            </div>

            <div className="buttons-container">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading !== null}
                    className="social-btn google-btn"
                >
                    {loading === 'google' ? (
                        <span className="spinner" />
                    ) : (
                        <FcGoogle size={24} />
                    )}
                    <span>Google</span>
                </button>

                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={loading !== null}
                    className="social-btn facebook-btn"
                >
                    {loading === 'facebook' ? (
                        <span className="spinner" />
                    ) : (
                        <FaFacebook size={24} color="#1877F2" />
                    )}
                    <span>Facebook</span>
                </button>

                <button
                    type="button"
                    onClick={handleAppleLogin}
                    disabled={loading !== null}
                    className="social-btn apple-btn"
                >
                    {loading === 'apple' ? (
                        <span className="spinner" />
                    ) : (
                        <FaApple size={24} />
                    )}
                    <span>Apple</span>
                </button>
            </div>

            <style jsx>{`
        .social-login-buttons {
          margin-top: 1.5rem;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }
        
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .divider span {
          padding: 0 1rem;
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .buttons-container {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .social-btn {
          flex: 1;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .social-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        
        .social-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .google-btn:hover:not(:disabled) {
          border-color: #ea4335;
        }
        
        .facebook-btn:hover:not(:disabled) {
          border-color: #1877F2;
        }
        
        .apple-btn:hover:not(:disabled) {
          border-color: #000;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .buttons-container {
            flex-direction: column;
          }
          
          .social-btn {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}
