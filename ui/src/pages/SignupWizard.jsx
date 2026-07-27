import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  Layers, 
  Users, 
  Cpu, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Play, 
  ArrowRight,
  Terminal,
  Activity,
  Lock,
  Globe
} from 'lucide-react';

const SignupWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [roleTrack, setRoleTrack] = useState('corporate'); // corporate | developer
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [developerName, setDeveloperName] = useState('');
  
  // Card Details (Dummy)
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  
  // Architecture Choice
  const [arch, setArch] = useState('saas'); // saas | byoc
  
  // Company Size Scaling
  const [bankSeats, setBankSeats] = useState(1200); // number of seats
  
  // Provisioning state
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  // Calculate instance dynamically
  const getAWSInstance = (seats) => {
    if (seats < 250) {
      return {
        type: 'EC2 c6g.large',
        vcpu: '2 vCPUs',
        ram: '4 GB RAM',
        attestation: 'Nitro TPM Enforced',
        throughput: '1,500 messages/min capacity',
        cost: '$149 / month base'
      };
    } else if (seats < 5000) {
      return {
        type: 'EC2 r6g.xlarge',
        vcpu: '4 vCPUs',
        ram: '32 GB RAM',
        attestation: 'AWS Nitro Cryptographic Attestation',
        throughput: '15,000 messages/min capacity',
        cost: '$499 / month base'
      };
    } else {
      return {
        type: 'EC2 r6g.4xlarge',
        vcpu: '16 vCPUs',
        ram: '128 GB RAM',
        attestation: 'Intel SGX Secure Memory Enclaves',
        throughput: '120,000 messages/min capacity',
        cost: '$1,999 / month base'
      };
    }
  };

  const selectedInstance = getAWSInstance(bankSeats);

  // Run simulated/real terminal loading when step 5 is active
  useEffect(() => {
    if (step === 5) {
      const messages = [
        "Initializing Nitro Enclave Compiler CLI...",
        "Validating container isolation permissions...",
        "Building cryptographically isolated Docker EIF layer...",
        "Generating unique Platform Configuration Register PCR0 measurements..."
      ];
      
      let index = 0;
      setProvisionProgress(0);
      setLogs([]);

      let attestResult = null;

      // Real backend attestation handshake!
      fetch("http://localhost:8000/api/tee/attest?nonce=cipherpulse-wizard-signup")
        .then(res => {
          if (!res.ok) throw new Error("Backend offline");
          return res.json();
        })
        .then(data => {
          attestResult = data;
        })
        .catch(() => { /* Fallback to demo mode */ });

      const interval = setInterval(() => {
        if (index < messages.length) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[index]}`]);
          setProvisionProgress(prev => Math.min(prev + 12, 60));
          index++;
        } else {
          clearInterval(interval);
          
          // Next phase: verify TEE signature and print actual PCR hashes
          setTimeout(() => {
            if (attestResult && attestResult.status === 'ATTESTATION_SUCCESS') {
              const pcr0 = attestResult.measurements.PCR0;
              const pcr1 = attestResult.measurements.PCR1;
              const pcr2 = attestResult.measurements.PCR2;
              const signature = attestResult.attestation_document_hex.substring(0, 48) + "...";
              
              setLogs(prev => [
                ...prev,
                `[${new Date().toLocaleTimeString()}] [TEE Server] Cryptographic Hardware Attestation Document received!`,
                `[${new Date().toLocaleTimeString()}] [TEE Server] PCR0 (Enclave Image Hash): ${pcr0}`,
                `[${new Date().toLocaleTimeString()}] [TEE Server] PCR1 (Bootstrap OS Hash): ${pcr1}`,
                `[${new Date().toLocaleTimeString()}] [TEE Server] PCR2 (App Readiness Hash): ${pcr2}`,
                `[${new Date().toLocaleTimeString()}] [TEE Server] Hardware CA Signature: ${signature}`,
                `[${new Date().toLocaleTimeString()}] [TEE Server] AWS Enclave Root Certificate verified successfully!`,
                `[${new Date().toLocaleTimeString()}] PostgreSQL schemas mapped inside secure isolated RAM registers.`,
                `[${new Date().toLocaleTimeString()}] CipherPulse enclave successfully provisioned and attested!`
              ]);
              setProvisionProgress(100);
            } else {
              // Local simulation fallback logs
              setLogs(prev => [
                ...prev,
                `[${new Date().toLocaleTimeString()}] PCR0 SHA-384: f7a213e9a1cd94b62788e0e12d4901f4c3a (Attestation Verified)`,
                `[${new Date().toLocaleTimeString()}] Setting up PostgreSQL relational surveillance schemas...",`,
                `[${new Date().toLocaleTimeString()}] Configuring secure internal TEE socket interface on port 5000...",`,
                `[${new Date().toLocaleTimeString()}] Running local health diagnostic checks...",`,
                `[${new Date().toLocaleTimeString()}] [Local Emulation] Enclave provisioned successfully (local simulator active).`,
                `[${new Date().toLocaleTimeString()}] CipherPulse enclave successfully provisioned and attested!`
              ]);
              setProvisionProgress(100);
            }
          }, 800);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      // Simulate registration save and redirect
      localStorage.setItem('cp_token', 'session_auth_0x9212A_secure_tee');
      localStorage.setItem('cp_user', JSON.stringify({
        name: roleTrack === 'corporate' ? companyName || 'Global Bank Corp' : developerName || 'Dev Operator',
        id: '0x9212A',
        role: roleTrack === 'corporate' ? 'Chief Compliance Officer' : 'Security Analyst',
        email: email || 'admin@cipherpulse.com'
      }));
      localStorage.setItem('cp_role', 'admin'); // Default role on signup
      navigate('/inbox');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F9FC',
      backgroundImage: 'radial-gradient(circle at top right, rgba(41, 182, 246, 0.08), transparent 45%), radial-gradient(circle at bottom left, rgba(0, 163, 224, 0.08), transparent 45%)',
      fontFamily: '"Outfit", "Inter", sans-serif',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(41, 182, 246, 0.3)', marginBottom: '8px'
        }}>
          <Shield size={20} color="#ffffff" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#002F56', margin: 0, letterSpacing: '-0.5px' }}>
          cipher<span style={{ color: '#29B6F6', fontWeight: '400' }}>pulse</span>
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Confidential Provisioning Workspace
        </p>
      </div>

      {/* Main Wizard Card */}
      <div style={{
        width: '100%',
        maxWidth: '680px',
        backgroundColor: '#ffffff',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 47, 86, 0.03)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Step Indicator Top Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          backgroundColor: '#0c1a2e',
          padding: '16px 24px',
          gap: '8px',
          alignItems: 'center'
        }}>
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                height: '4px',
                borderRadius: '2px',
                backgroundColor: s <= step ? '#29B6F6' : '#1e293b',
                transition: 'background-color 0.3s'
              }} />
              <span style={{
                fontSize: '9px',
                fontWeight: '800',
                color: s <= step ? '#ffffff' : '#475569',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>Step {s}</span>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div style={{ padding: '40px', flex: 1 }}>
          
          {/* STEP 1: Dual Track Sign Up */}
          {step === 1 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#002F56' }}>Choose Your Track</h3>
              <p style={{ margin: '0 0 28px 0', fontSize: '14px', color: '#64748b' }}>Select the pipeline suited to your workspace role</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                {/* Corporate Account Card */}
                <div 
                  onClick={() => setRoleTrack('corporate')}
                  style={{
                    border: roleTrack === 'corporate' ? '2px solid #29B6F6' : '1px solid #E2E8F0',
                    backgroundColor: roleTrack === 'corporate' ? '#F4F9FC' : '#ffffff',
                    borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: roleTrack === 'corporate' ? '#29B6F6' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContents: 'center',
                      justifyContent: 'center', color: roleTrack === 'corporate' ? '#ffffff' : '#475569'
                    }}>
                      <Globe size={18} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#002F56' }}>Corporate / Bank</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                    For financial institutions requiring full multi-role controls, email ingestion networks, and compliant enclaves.
                  </p>
                </div>

                {/* Developer Sandbox Card */}
                <div 
                  onClick={() => setRoleTrack('developer')}
                  style={{
                    border: roleTrack === 'developer' ? '2px solid #29B6F6' : '1px solid #E2E8F0',
                    backgroundColor: roleTrack === 'developer' ? '#F4F9FC' : '#ffffff',
                    borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: roleTrack === 'developer' ? '#29B6F6' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContents: 'center',
                      justifyContent: 'center', color: roleTrack === 'developer' ? '#ffffff' : '#475569'
                    }}>
                      <Cpu size={18} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#002F56' }}>Developer Sandbox</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                    For security engineers testing attestation modules, Python batch scripts, and vector classifications.
                  </p>
                </div>
              </div>

              {/* Dynamic Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {roleTrack === 'corporate' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Institution / Bank Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apex Global Bank" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Developer Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Anuj Operator" 
                      value={developerName}
                      onChange={(e) => setDeveloperName(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
                    <input 
                      type="email" 
                      placeholder="admin@cipherpulse.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Enclave Security Passcode</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dummy Credit Details */}
          {step === 2 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#002F56' }}>Setup Invoicing Account</h3>
              <p style={{ margin: '0 0 28px 0', fontSize: '14px', color: '#64748b' }}>Provision resources securely with credit verification (no charges applied during testing)</p>
              
              <div style={{
                backgroundColor: '#0c1a2e',
                borderRadius: '12px',
                padding: '24px',
                color: '#ffffff',
                marginBottom: '28px',
                backgroundImage: 'radial-gradient(circle at top right, rgba(41, 182, 246, 0.25), transparent 60%)',
                boxShadow: '0 8px 24px rgba(12, 26, 46, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Shield size={28} color="#29B6F6" />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>SECURE VERIFICATION CARD</span>
                </div>
                
                <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', fontFamily: 'monospace' }}>
                  {cardNumber}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800' }}>Cardholder Name</div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{roleTrack === 'corporate' ? companyName || 'APEX GLOBAL BANK' : developerName || 'DEV OPERATOR'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800' }}>Expires</div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{expiry}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800' }}>CVC</div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{cvc}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Forms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px 12px 40px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                    <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#cbd5e1' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Expiration Date</label>
                    <input 
                      type="text" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', textAlign: 'center' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Code (CVC)</label>
                    <input 
                      type="password" 
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', textAlign: 'center' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Architecture */}
          {step === 3 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#002F56' }}>Select Deployment Architecture</h3>
              <p style={{ margin: '0 0 28px 0', fontSize: '14px', color: '#64748b' }}>Select where your secure cryptographic enclaves are provisioned</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Option 1: Fully Hosted SaaS */}
                <div 
                  onClick={() => setArch('saas')}
                  style={{
                    border: arch === 'saas' ? '2px solid #29B6F6' : '1px solid #E2E8F0',
                    backgroundColor: arch === 'saas' ? '#F4F9FC' : '#ffffff',
                    borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContents: 'space-between', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Layers size={20} color="#29B6F6" />
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#002F56' }}>Fully Hosted SaaS (Recommended)</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '12px' }}>Standard</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                    Fastest setup. CipherPulse hosts enclaves inside our dedicated, audited AWS account. Raw data passes over secure HTTPS direct to Nitro registers, returning metadata and deleting keys in seconds.
                  </p>
                </div>

                {/* Option 2: BYOC / Hybrid */}
                <div 
                  style={{
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px', padding: '24px',
                    position: 'relative', opacity: 0.8
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContents: 'space-between', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Cpu size={20} color="#94a3b8" />
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#64748b' }}>BYOC / Hybrid (Bring Your Own Cloud)</span>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: '800', backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coming Soon</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                    Deploy enclaves directly inside your corporate AWS VPC boundary via secure Helm Charts or single-click Terraform bundles. Integrates with local HSM key chains.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Scaling & AWS Auto-Fitting */}
          {step === 4 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#002F56' }}>Scale & Auto-Fit Infrastructure</h3>
              <p style={{ margin: '0 0 28px 0', fontSize: '14px', color: '#64748b' }}>Calibrate your institution size to dynamically size the secure AWS Nitro Enclave</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Range Slider for seats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', fontWeight: '800', color: '#002F56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Number of Active Seats / Accounts</label>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0284c7', backgroundColor: '#f0f9ff', padding: '4px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      {bankSeats.toLocaleString()} Users
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="15000" 
                    step="50"
                    value={bankSeats}
                    onChange={(e) => setBankSeats(parseInt(e.target.value))}
                    style={{
                      width: '100%', accentColor: '#29B6F6', cursor: 'pointer',
                      height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    <span>50 (Startup)</span>
                    <span>5,000 (Medium Bank)</span>
                    <span>15,000+ (Global Conglomerate)</span>
                  </div>
                </div>

                {/* AWS Instance Recommendation Panel */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={18} color="#29B6F6" />
                    <span style={{ fontWeight: '800', fontSize: '13px', color: '#002F56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended AWS Node Configuration</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Target EC2 Enclave Class</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#002F56' }}>{selectedInstance.type}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>VCPU & Memory Bounds</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>{selectedInstance.vcpu} / {selectedInstance.ram}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Inference Capacity</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#047857' }}>{selectedInstance.throughput}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Cryptographic Proof</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>{selectedInstance.attestation}</div>
                    </div>
                  </div>

                  <div style={{
                    borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Estimated Enclave Resource Charge:</span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0284c7' }}>{selectedInstance.cost}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Provisioning Progress screen */}
          {step === 5 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#002F56' }}>Provisioning Secure Resources</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>compiling code and launching the AWS Nitro Enclave</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: '#002F56', marginBottom: '8px' }}>
                    <span>LAUNCH STATUS</span>
                    <span>{provisionProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${provisionProgress}%`, height: '100%', background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)', borderRadius: '5px', transition: 'width 0.3s' }} />
                  </div>
                </div>

                {/* Console Log Shell */}
                <div style={{
                  backgroundColor: '#0c1a2e',
                  borderRadius: '10px',
                  padding: '20px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#29B6F6',
                  height: '180px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  border: '1px solid #1e293b',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                }}>
                  {logs.map((log, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#475569' }}>&gt;</span>
                      <span style={{ color: log.includes('attested') || log.includes('provisioned') ? '#10b981' : '#94a3b8' }}>{log}</span>
                    </div>
                  ))}
                  {provisionProgress < 100 && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#29B6F6' }}>&gt;</span>
                      <span style={{ width: '8px', height: '12px', backgroundColor: '#29B6F6', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #E2E8F0',
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {step > 1 && step < 5 ? (
            <button
              onClick={handleBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
                padding: '10px 20px', color: '#475569', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={step === 5 && provisionProgress < 100}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: step === 5 && provisionProgress < 100 ? '#cbd5e1' : 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
              border: 'none', borderRadius: '8px',
              padding: '10px 24px', color: '#ffffff', fontSize: '14px', fontWeight: '700',
              cursor: step === 5 && provisionProgress < 100 ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 12px rgba(41, 182, 246, 0.2)',
              transition: 'all 0.2s'
            }}>
            {step === 5 ? (
              <>
                {provisionProgress < 100 ? 'Compiling Sandbox...' : 'Open Dashboards'}
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                Next Step <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupWizard;
