import React from 'react';
import { ShieldCheck, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#081424',
      borderTop: '1px solid #1e293b',
      padding: '80px 48px 40px 48px',
      color: '#94a3b8',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr', gap: '64px' }}>
        
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(41, 182, 246, 0.2)'
            }}>
              <ShieldCheck size={18} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              color: '#ffffff', 
              letterSpacing: '-1px'
            }}>
              cipher<span style={{ color: '#29B6F6', fontWeight: '400' }}>pulse</span>
            </span>
          </Link>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
            Mobilize compliance communications risk surveillance in secure hardware enclaves. The trusted data audit platform for modern enterprises.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {[
              { 
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                ), 
                url: 'https://linkedin.com' 
              },
              { 
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ), 
                url: 'https://twitter.com' 
              },
              { 
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                ), 
                url: 'https://github.com' 
              },
              { 
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.553 12 3.553 12 3.553s-7.518 0-9.388.503a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.503 9.388.503 9.388.503s7.518 0 9.388-.503a3.003 3.003 0 0 0 2.11-2.11c.502-1.87.502-5.837.502-5.837s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ), 
                url: 'https://youtube.com' 
              }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  color: '#94a3b8', 
                  transition: 'color 0.2s, transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#29B6F6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Cortex Code', path: '/inbox' },
              { name: 'Compliance Cloud', path: '/inbox' },
              { name: 'Nitro Enclaves', path: '/inbox' },
              { name: 'Developer Tools', path: '/inbox' },
              { name: 'Pricing & Tiers', path: '/inbox' }
            ].map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.path} 
                  style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Solutions Column */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Solutions</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Insider Threat', path: '/inbox' },
              { name: 'RegTech Compliance', path: '/inbox' },
              { name: 'Safe Data Vaults', path: '/inbox' },
              { name: 'Audit Automation', path: '/inbox' },
              { name: 'Horizon Cataloging', path: '/inbox' }
            ].map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.path} 
                  style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscription Newsletter Column */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Subscribe to our newsletter</h4>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
            Get the latest product updates, security insights, and compliance guides.
          </p>
          <form 
            onSubmit={(e) => e.preventDefault()}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <input 
              type="email" 
              placeholder="Business Email Address"
              required
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#29B6F6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#334155'}
            />
            
            <input 
              type="text" 
              placeholder="Company Name"
              required
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#29B6F6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#334155'}
            />

            <button 
              type="submit"
              style={{
                backgroundColor: '#29B6F6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 20px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00A3E0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#29B6F6'}
            >
              <span>Subscribe Now</span>
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>
      
      {/* Bottom Row bar */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '64px auto 0 auto', 
        borderTop: '1px solid #1e293b', 
        paddingTop: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '13px'
      }}>
        <p style={{ margin: 0 }}>© 2026 CipherPulse Inc. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { name: 'Privacy Policy', path: '/inbox' },
            { name: 'Terms of Service', path: '/inbox' },
            { name: 'Cookie Preferences', path: '/inbox' }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path} 
              style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
