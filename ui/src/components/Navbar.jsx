import React, { useState } from 'react';
import { Search, Globe, ChevronDown, X, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Summit Banner */}
      {showBanner && (
        <div style={{
          backgroundColor: '#002F56',
          color: '#ffffff',
          padding: '10px 48px',
          fontSize: '13px',
          fontWeight: '500',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontFamily: '"Outfit", sans-serif',
          zIndex: 1001,
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: '#29B6F6', fontWeight: '800' }}>🔒 Welcome to CipherPulse</span>
            <span style={{ opacity: 0.8 }}>— The privacy-preserving, AI-powered communications surveillance platform.</span>
            <Link to="/login" style={{ color: '#ffffff', fontWeight: '800', textDecoration: 'underline', marginLeft: '6px' }}>Explore Enclaves</Link>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            style={{
              position: 'absolute',
              right: '24px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
            title="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Navigation Main Header */}
      <nav style={{
        height: '80px',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 47, 86, 0.03)',
        fontFamily: '"Outfit", sans-serif'
      }}>
        {/* Left Section: Premium Snowflake-styled Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(41, 182, 246, 0.3)',
              position: 'relative'
            }}>
              <ShieldCheck size={22} color="#ffffff" strokeWidth={2.5} />
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                top: '6px',
                right: '6px',
                animation: 'pulse-soft 2s infinite'
              }} />
            </div>
            <span style={{ 
              fontSize: '26px', 
              fontWeight: '800', 
              color: '#002F56', 
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center'
            }}>
              cipher<span style={{ color: '#29B6F6', fontWeight: '400' }}>pulse</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            {[
              { name: 'Product', active: true },
              { name: 'Solutions' },
              { name: 'Why CipherPulse' },
              { name: 'Resources' },
              { name: 'Developers' },
              { name: 'Pricing' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  cursor: 'pointer',
                  color: '#002F56',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#29B6F6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#002F56'}
              >
                <span>{item.name}</span>
                {item.name !== 'Pricing' && <ChevronDown size={14} style={{ opacity: 0.7 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#002F56' }}>
            <Globe 
              size={20} 
              style={{ cursor: 'pointer', opacity: 0.8, transition: 'color 0.2s' }} 
              onMouseEnter={(e) => e.currentTarget.style.color = '#29B6F6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#002F56'}
            />
            <Search 
              size={20} 
              style={{ cursor: 'pointer', opacity: 0.8, transition: 'color 0.2s' }} 
              onMouseEnter={(e) => e.currentTarget.style.color = '#29B6F6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#002F56'}
            />
            <Link 
              to="/login" 
              style={{ 
                color: '#002F56', 
                textDecoration: 'none', 
                fontWeight: '700', 
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#29B6F6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#002F56'}
            >
              Sign In
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link 
              to="/inbox" 
              style={{ 
                color: '#002F56', 
                textDecoration: 'none', 
                fontWeight: '700', 
                fontSize: '14px', 
                padding: '10px 20px', 
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F4F9FC';
                e.currentTarget.style.borderColor = '#002F56';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              Contact Sales
            </Link>
            
            <Link 
              to="/signup" 
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                fontWeight: '700', 
                fontSize: '14px', 
                backgroundColor: '#29B6F6', 
                padding: '10px 24px', 
                borderRadius: '9999px',
                boxShadow: '0 4px 10px rgba(41, 182, 246, 0.25)',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00A3E0';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(41, 182, 246, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#29B6F6';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(41, 182, 246, 0.25)';
              }}
            >
              Start for free
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
