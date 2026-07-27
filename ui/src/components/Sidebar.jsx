import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Folder, 
  BarChart2, 
  Sliders, 
  Activity, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Cpu,
  Database,
  Network,
  Lock,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: 'ANUJ KUMAR', id: '0x9212A', role: 'CHIEF COMPLIANCE OFFICER' });
  const [isTeeActive, setIsTeeActive] = useState(false);
  const [activeRole, setActiveRole] = useState('admin');
  const [showAccessDenied, setShowAccessDenied] = useState(null);

  useEffect(() => {
    // Retrieve mock session user info
    const cpUser = localStorage.getItem('cp_user');
    if (cpUser) {
      const parsedUser = JSON.parse(cpUser);
      setUser({
        name: parsedUser.name === 'Compliance Officer' ? 'ANUJ KUMAR' : parsedUser.name.toUpperCase(),
        id: parsedUser.id || '0x9212A',
        role: parsedUser.role === 'Surveillance Lead' ? 'CHIEF COMPLIANCE OFFICER' : parsedUser.role.toUpperCase()
      });
    }
    
    // Check if TEE is enabled in localStorage
    const useTee = localStorage.getItem('settings_use_tee');
    setIsTeeActive(useTee === 'true');

    // Check active role
    const cpRole = localStorage.getItem('cp_role') || 'admin';
    setActiveRole(cpRole);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    localStorage.removeItem('cp_role');
    navigate('/login');
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    localStorage.setItem('cp_role', role);
    setActiveRole(role);
    // Reload components depending on role
    window.dispatchEvent(new Event('roleChanged'));
    
    // If analyst and currently on admin-only route, redirect to inbox
    const adminRoutes = ['/blueprint', '/sql-analyzer', '/metrics', '/settings'];
    if (role === 'analyst' && adminRoutes.includes(location.pathname)) {
      navigate('/inbox');
    }
  };

  const navItems = [
    { name: 'Review Inbox', path: '/inbox', icon: <Folder size={16} />, adminOnly: false },
    { name: 'Scored Results', path: '/analysis', icon: <FileText size={16} />, adminOnly: false },
    { name: 'Compliance Analytics', path: '/analytics', icon: <BarChart2 size={16} />, adminOnly: false },
    { name: 'Blueprint Explorer', path: '/blueprint', icon: <Network size={16} />, adminOnly: true },
    { name: 'SQL Analyzer', path: '/sql-analyzer', icon: <Database size={16} />, adminOnly: true },
    { name: 'System Metrics', path: '/metrics', icon: <Activity size={16} />, adminOnly: true },
    { name: 'Model Settings', path: '/settings', icon: <Sliders size={16} />, adminOnly: true },
  ];

  const handleNavClick = (item) => {
    if (item.adminOnly && activeRole !== 'admin') {
      setShowAccessDenied(item.name);
      setTimeout(() => setShowAccessDenied(null), 3500);
      return;
    }
    navigate(item.path);
  };

  return (
    <div style={{
      width: '260px',
      backgroundColor: '#0c1a2e',
      borderRight: '1px solid #1e293b',
      color: '#94a3b8',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      fontFamily: '"Inter", sans-serif',
      flexShrink: 0,
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        height: '80px'
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(41, 182, 246, 0.3)'
        }}>
          <ShieldCheck size={18} color="#ffffff" strokeWidth={2.5} />
        </div>
        <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' }}>
          cipher<span style={{ color: '#29B6F6', fontWeight: '400' }}>pulse</span>
        </span>
      </div>

      {/* Access Denied Warning Toast inside Sidebar */}
      {showAccessDenied && (
        <div style={{
          margin: '10px 16px',
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ef4444',
          fontSize: '12px',
          animation: 'shake 0.3s ease-in-out'
        }}>
          <ShieldAlert size={16} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800' }}>ACCESS DENIED</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Admin role required for {showAccessDenied}.</div>
          </div>
        </div>
      )}

      {/* Role Swapper Dropdown */}
      <div style={{ padding: '16px 20px 8px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <UserCheck size={12} /> Active Persona Role
          </div>
          <select 
            value={activeRole} 
            onChange={handleRoleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#111f35',
              border: '1px solid #1e293b',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
            }}>
            <option value="admin">Admin (System Lead)</option>
            <option value="analyst">Analyst (Surveillance)</option>
          </select>
        </div>
      </div>

      {/* TEE Secure Status Indicator Badge */}
      <div style={{ padding: '8px 20px' }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: isTeeActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          border: isTeeActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {isTeeActive ? (
            <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
          ) : (
            <Cpu size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
          )}
          <div>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '800', 
              color: isTeeActive ? '#10b981' : '#f59e0b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {isTeeActive ? 'Secure TEE Active' : 'TCP Simulator'}
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', fontWeight: '600' }}>
              {isTeeActive ? 'AWS Nitro Enclave Enforced' : 'Local Fallback Mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: '800', 
          color: '#475569', 
          textTransform: 'uppercase', 
          padding: '0 12px 8px 12px',
          letterSpacing: '1px'
        }}>
          Surveillance Suite
        </div>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isRestricted = item.adminOnly && activeRole !== 'admin';
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(41, 182, 246, 0.15)' : 'transparent',
                color: isRestricted ? '#475569' : isActive ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s',
                outline: 'none',
                fontFamily: '"Inter", sans-serif',
                opacity: isRestricted ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isRestricted) {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !isRestricted) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.icon}
                <span>{item.name}</span>
              </div>
              {isRestricted ? (
                <Lock size={12} color="#475569" />
              ) : (
                isActive && <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#29B6F6' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* User Session Profile & Sign Out */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0a1526'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '800', color: '#29B6F6', border: '1px solid rgba(41,182,246,0.3)',
            flexShrink: 0
          }}>
            AK
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Role: {activeRole.toUpperCase()}</div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
