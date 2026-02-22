import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Lock, User, ArrowRight, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
            localStorage.setItem('token', res.data.token);
            toast.success('✅ Access Granted. Welcome, Admin!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || '❌ Invalid credentials. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '80vh', padding: '20px',
        }}>
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{ padding: '40px 36px', width: '100%', maxWidth: 440 }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16,
                        background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 0 30px rgba(168,85,247,0.5)',
                    }}>
                        <Shield style={{ width: 30, height: 30, color: '#fff' }} />
                    </div>
                    <h2 style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.8rem',
                        letterSpacing: '-0.02em', marginBottom: 6,
                    }}>Admin Login</h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem',
                        fontFamily: "'Inter', sans-serif",
                    }}>CinemaVerse Management Portal</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Username */}
                    <div>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                            color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8,
                        }}>
                            <User style={{ width: 13, height: 13, color: '#a855f7' }} />
                            Username
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter admin username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                            color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8,
                        }}>
                            <Lock style={{ width: 13, height: 13, color: '#a855f7' }} />
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                className="input-field"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ paddingRight: 48 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 600,
                                }}
                            >
                                {showPass ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-download-primary btn-ripple"
                        style={{
                            width: '100%', justifyContent: 'center',
                            padding: '14px 24px', marginTop: 8, fontSize: '1rem',
                            opacity: isLoading ? 0.65 : 1, cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight style={{ width: 18, height: 18 }} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: 28, paddingTop: 20,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)',
                        fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
                    }}>
                        🔒 Secured with JWT Authentication<br />
                        Unauthorized access attempts are logged.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
