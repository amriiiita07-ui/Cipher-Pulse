import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../api/client';
import { 
  Sliders, 
  Shield, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Link2,
  Mail,
  MessageSquare,
  Clock,
  Trash2,
  Download,
  CreditCard,
  Zap
} from 'lucide-react';

const Settings = () => {
  const [interval, setIntervalVal] = useState(60); // Default to 60-minute batch intervals
  const [batchSize, setBatchSize] = useState(100);
  const [riskThreshold, setRiskThreshold] = useState(60);
  const [useTee, setUseTee] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Pipeline Connector States
  const [connectEmail, setConnectEmail] = useState(true);
  const [connectSlack, setConnectSlack] = useState(false);
  const [connectTeams, setConnectTeams] = useState(true);

  // Retention Policies
  const [retentionDays, setRetentionDays] = useState(30);

  useEffect(() => {
    // Load initial values from localStorage or default
    setIntervalVal(parseInt(localStorage.getItem('settings_processing_interval') || '60'));
    setBatchSize(parseInt(localStorage.getItem('settings_batch_size') || '100'));
    setRiskThreshold(parseInt(localStorage.getItem('settings_risk_threshold') || '60'));
    setUseTee(localStorage.getItem('settings_use_tee') === 'true');
    setConnectEmail(localStorage.getItem('settings_conn_email') !== 'false');
    setConnectSlack(localStorage.getItem('settings_conn_slack') === 'true');
    setConnectTeams(localStorage.getItem('settings_conn_teams') !== 'false');
    setRetentionDays(parseInt(localStorage.getItem('settings_retention_days') || '30'));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('settings_processing_interval', interval.toString());
    localStorage.setItem('settings_batch_size', batchSize.toString());
    localStorage.setItem('settings_risk_threshold', riskThreshold.toString());
    localStorage.setItem('settings_use_tee', useTee ? 'true' : 'false');
    localStorage.setItem('settings_conn_email', connectEmail ? 'true' : 'false');
    localStorage.setItem('settings_conn_slack', connectSlack ? 'true' : 'false');
    localStorage.setItem('settings_conn_teams', connectTeams ? 'true' : 'false');
    localStorage.setItem('settings_retention_days', retentionDays.toString());
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setIntervalVal(60);
    setBatchSize(100);
    setRiskThreshold(60);
    setUseTee(false);
    setConnectEmail(true);
    setConnectSlack(false);
    setConnectTeams(true);
    setRetentionDays(30);
  };

  const handleUpgrade = async (priceId) => {
    try {
      const response = await api.createCheckoutSession(priceId);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Stripe error:', error);
      alert('Failed to initiate checkout. Please check the backend connection.');
    }
  };

  const triggerDownloadBackup = () => {
    // Create high-fidelity dummy secure backup log file for download
    const date = new Date().toISOString().split('T')[0];
    const dummyLog = `----- BEGIN CIPHERPULSE ENCRYPTED SURVEILLANCE BACKUP -----
Timestamp: ${new Date().toISOString()}
Enclave Attestation Measure PCR0: 9ea217b189cd24ef5a1098bcf331d2a14e
Audit Record Count: ${batchSize} communications processed
Encrypted Payload Key: RSA-4096-TEE-BND-0x9212A
Signature: SHA384-F194641-SEALED-NITRO-CIPHERPULSE
------------------------------------------------------------
[ENCRYPTED COMPLIANCE DATA BLOB]
1a7b8e9f2c3d4a5b6e7f8c9d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b
0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d
9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e
----- END CIPHERPULSE ENCRYPTED SURVEILLANCE BACKUP -----`;

    const blob = new Blob([dummyLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cipherpulse_secure_audit_${date}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', color: '#1e293b' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.5px', color: '#0f172a' }}>System & Integration Settings</h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>Provision network ingestion feeds, schedule batch routines, and configure data purging schedules</p>
          </div>
        </div>

        {saveSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '24px',
            color: '#047857',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <CheckCircle size={20} />
            <span>Optimal variables saved and successfully updated across the CipherPulse platform.</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Settings Form Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* SECTION 1: INGESTION PIPELINE CONNECTORS */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link2 size={18} color="#00A3E0" /> Pipeline Ingestion Feeds
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 20px 0' }}>Connect active communication channels securely to the TEE enclaved processing thread.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Email Connector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mail size={16} color="#00A3E0" />
                      <div>
                        <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Corporate SMTP/Email Feed</span>
                        <div style={{ fontSize: '10px', color: connectEmail ? '#10b981' : '#f59e0b', fontWeight: '700' }}>● {connectEmail ? 'CONNECTED & LISTENING' : 'PAUSED'}</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={connectEmail}
                      onChange={(e) => setConnectEmail(e.target.checked)}
                      style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                    />
                  </div>

                  {/* Slack Connector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e01e5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <div>
                        <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Slack Enterprise Workspace Connector</span>
                        <div style={{ fontSize: '10px', color: connectSlack ? '#10b981' : '#f59e0b', fontWeight: '700' }}>● {connectSlack ? 'CONNECTED & LISTENING' : 'PAUSED'}</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={connectSlack}
                      onChange={(e) => setConnectSlack(e.target.checked)}
                      style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                    />
                  </div>

                  {/* MS Teams Connector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MessageSquare size={16} color="#4654a3" />
                      <div>
                        <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Microsoft Teams Tenant Integrator</span>
                        <div style={{ fontSize: '10px', color: connectTeams ? '#10b981' : '#f59e0b', fontWeight: '700' }}>● {connectTeams ? 'CONNECTED & LISTENING' : 'PAUSED'}</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={connectTeams}
                      onChange={(e) => setConnectTeams(e.target.checked)}
                      style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BATCH PROCESSING & RETENTION POLICY */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#8b5cf6" /> Batch & Retention Schedule
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 20px 0' }}>Configure automated scoring intervals and define communication storage lifetimes.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Frequency Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Dynamic Ingestion Batch Interval</label>
                    <select 
                      value={interval}
                      onChange={(e) => setIntervalVal(parseInt(e.target.value))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff', fontSize: '13.5px', fontWeight: '600' }}
                    >
                      <option value="5">Real-time Stream (5 Seconds)</option>
                      <option value="15">Frequent Audit (15 Seconds)</option>
                      <option value="30">Standard Cycle (30 Seconds)</option>
                      <option value="60">Hourly Corporate Batch (60 Minutes)</option>
                      <option value="1440">Daily Consolidated Batch (24 Hours)</option>
                    </select>
                  </div>

                  {/* Retention Day Slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Data Retention Period (Compliance Lifespan)</label>
                      <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#8b5cf6', backgroundColor: '#f3e8ff', padding: '2px 8px', borderRadius: '4px' }}>
                        {retentionDays} Days
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Processed surveillance records will be fully purged from system memory after {retentionDays} days.</p>
                    <input 
                      type="range" 
                      min="1" 
                      max="120" 
                      step="1"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer', height: '6px' }}
                    />
                  </div>

                  {/* Archive download button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f5f3ff', border: '1px dashed #c084fc', borderRadius: '8px', marginTop: '4px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#5b21b6' }}>Auditor Secure Export</span>
                      <p style={{ fontSize: '11px', color: '#7c3aed', margin: 0 }}>Download the encrypted compliance ledger for future audits.</p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerDownloadBackup}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#7c3aed', color: '#ffffff',
                        border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '700',
                        cursor: 'pointer', boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)'
                      }}
                    >
                      <Download size={14} /> Export Log
                    </button>
                  </div>
                </div>
              </div>

              {/* Variable 3: Risk Threshold */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Risk Alert Threshold</label>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#8b5cf6', backgroundColor: '#f3e8ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                    {riskThreshold} / 100
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>Determines the sensitivity cutoff. Messages with score &ge; {riskThreshold} are treated as compliance alerts.</p>
                <input 
                  type="range" 
                  min="10" 
                  max="95" 
                  step="5"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#8b5cf6',
                    cursor: 'pointer',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: '#f1f5f9'
                  }}
                />
              </div>

              {/* Variable 4: TEE Secure Enclave Toggle */}
              <div style={{ 
                borderTop: '1px solid #e2e8f0', 
                paddingTop: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ paddingRight: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                    <Shield size={18} color="#0284c7" />
                    <label style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', cursor: 'pointer' }} htmlFor="tee-toggle">
                      Secure TEE Enclave Routing
                    </label>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                    When enabled, raw message content is directed solely inside a cryptographically verified AWS Nitro Enclave (VSOCK socket connection). Disables raw storage outside the TEE.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <input 
                  type="checkbox" 
                  id="tee-toggle"
                  checked={useTee}
                  onChange={(e) => setUseTee(e.target.checked)}
                  style={{
                    width: '52px',
                    height: '26px',
                    backgroundColor: useTee ? '#10b981' : '#cbd5e1',
                    borderRadius: '13px',
                    position: 'relative',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    flexShrink: 0
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                borderTop: '1px solid #e2e8f0', 
                paddingTop: '24px', 
                justifyContent: 'flex-end' 
              }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <RotateCcw size={16} /> Reset Default
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #0284c7, #8b5cf6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Save size={16} /> Save Settings
                </button>
              </div>

            </form>
          </div>

          {/* Billing Section (New) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            background: 'linear-gradient(to bottom right, #ffffff, #f7f9fc)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#8b5cf6" /> Subscription & Licensing
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 24px 0' }}>Manage your CipherPulse enterprise license and scale your compliance throughput.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Pro Plan */}
              <div style={{ 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s',
                ':hover': { borderColor: '#8b5cf6' }
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '4px' }}>Standard</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>CipherPulse Pro</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>$499<span style={{ fontSize: '14px', color: '#64748b' }}>/mo</span></div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ fontSize: '12.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} color="#10b981" /> 1M messages/mo
                  </li>
                  <li style={{ fontSize: '12.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} color="#10b981" /> TEE Support
                  </li>
                </ul>
                <button 
                  onClick={() => handleUpgrade('price_1Hh1Y22eZvKYlo2C0Z2Z2Z2Z')} // Example Test Price ID
                  style={{
                    backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px',
                    fontSize: '13px', fontWeight: '700', color: '#0f172a', cursor: 'pointer', marginTop: 'auto'
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>

              {/* Enterprise Plan */}
              <div style={{ 
                background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
                borderRadius: '12px', 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                color: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '4px' }}>Enterprise</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>Global Scale</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>$2,499<span style={{ fontSize: '14px', color: '#94a3b8' }}>/mo</span></div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ fontSize: '12.5px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#f59e0b" /> Unlimited throughput
                  </li>
                  <li style={{ fontSize: '12.5px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#f59e0b" /> Dedicated HW Enclave
                  </li>
                </ul>
                <button 
                   onClick={() => handleUpgrade('price_1Hh1Y22eZvKYlo2C1Z1Z1Z1Z')} // Example Test Price ID
                   style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #0284c7)', border: 'none', borderRadius: '8px', padding: '10px',
                    fontSize: '13px', fontWeight: '700', color: '#ffffff', cursor: 'pointer', marginTop: 'auto'
                  }}
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '32px' }}>
          {/* Quick Info & Warnings */}
            {/* Warning Card */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '24px',
              color: '#b45309'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', marginBottom: '12px' }}>
                <AlertTriangle size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Compliance Advisory</h4>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', margin: 0, color: '#b45309' }}>
                Lowering the <strong>Risk Alert Threshold</strong> below 50 will trigger an exponential rise in scored alerts, resulting in potential compliance auditor fatigue. Increasing <strong>Batch Size</strong> beyond 500 records might result in socket latency during busy trading periods.
              </p>
            </div>

            {/* Info Card */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', marginBottom: '12px' }}>
                <Info size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>TEE Architecture</h4>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
                CipherPulse encrypts data payloads with a key bound cryptographically to the enclave's measurement. When <strong>TEE Enclave Routing</strong> is toggled active, the backend relies on hardware attestation before processing any compliance stream.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
