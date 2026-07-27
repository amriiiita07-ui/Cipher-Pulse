import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate enterprise authentication
    setTimeout(() => {
      if (email === 'admin@cipherpulse.com' && password === 'password123') {
        localStorage.setItem('cp_token', 'session_auth_0x9212A_secure_tee');
        localStorage.setItem('cp_user', JSON.stringify({
          name: 'Compliance Officer',
          id: '0x9212A',
          role: 'Surveillance Lead',
          email: email
        }));
        navigate('/inbox');
      } else {
        setError('Invalid corporate credentials or unauthorized access key.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#F4F9FC', 
      backgroundImage: 'radial-gradient(circle at top right, rgba(41, 182, 246, 0.08), transparent 45%), radial-gradient(circle at bottom left, rgba(0, 163, 224, 0.08), transparent 45%)',
      fontFamily: '"Outfit", "Inter", sans-serif',
      padding: '24px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #E2E8F0', 
        borderRadius: '16px', 
        padding: '40px', 
        boxShadow: '0 20px 40px rgba(0, 47, 86, 0.04)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(41, 182, 246, 0.25)'
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0', letterSpacing: '-1px' }}>
            cipher<span style={{ color: '#29B6F6', fontWeight: '400' }}>pulse</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0, fontWeight: '500' }}>Confidential Surveillance Suite</p>
        </div>

        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '12px 16px', 
            marginBottom: '24px', 
            color: '#ef4444', 
            fontSize: '13px',
            fontWeight: '600'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Corporate Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#cbd5e1' }}>
                <User size={18} />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cipherpulse.com"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 44px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  color: '#002F56', 
                  fontSize: '14px',
                  fontFamily: '"Outfit", sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Password input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Passcode</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#cbd5e1' }}>
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 44px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  color: '#002F56', 
                  fontSize: '14px',
                  fontFamily: '"Outfit", sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '10px',
              padding: '14px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)', 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '14px',
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              boxShadow: '0 4px 14px rgba(41, 182, 246, 0.3)',
              transition: 'transform 0.2s, opacity 0.2s',
              opacity: loading ? 0.8 : 1,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: '"Outfit", sans-serif'
            }}
          >
            {loading ? 'Authenticating Enclave...' : 'Access Dashboard'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '13.5px', color: '#64748b' }}>Need to scale or deploy a new node? </span>
          <span 
            onClick={() => navigate('/signup')} 
            style={{ fontSize: '13.5px', color: '#00A3E0', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Provision Enclave
          </span>
        </div>

        {/* Credentials hints for demo ease */}
        <div style={{ 
          marginTop: '32px', 
          borderTop: '1px solid #E2E8F0', 
          paddingTop: '20px', 
          fontSize: '12px', 
          color: '#64748b', 
          textAlign: 'center' 
        }}>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Access Credentials:</span>
          <span>Username: <code style={{ color: '#00A3E0', fontWeight: '700' }}>admin@cipherpulse.com</code></span>
          <span style={{ display: 'block' }}>Password: <code style={{ color: '#00A3E0', fontWeight: '700' }}>password123</code></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
