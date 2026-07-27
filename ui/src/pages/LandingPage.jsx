import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Search, FileText, ArrowRight, CheckCircle2, 
  Cpu, Database, Network, Terminal, Activity, ArrowUpRight, Zap, RefreshCw, Play, Trash2,
  Code, Layers, HelpCircle, User, Bell, ChevronRight, HardDrive, BarChart2, Shield, Settings,
  AlertTriangle, Filter, DatabaseZap, CheckCircle, FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  // Main Toggle State: 'CODE' or 'WORK'
  const [toggleMode, setToggleMode] = useState('CODE');
  
  // Tab State for "SECURE SURVEILLANCE COMPLIANCE"
  const [activeTab, setActiveTab] = useState('Developer');

  // Input & Simulation State
  const [inputText, setInputText] = useState("Hey, keep this between us — we need to buy 50,000 shares of Meridian before Q3 earnings drop tomorrow.");
  const [sandboxResult, setSandboxResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pingTime, setPingTime] = useState(36);
  
  // Auto-ping timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPingTime(Math.floor(Math.random() * (42 - 34 + 1)) + 34);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSandboxAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setSandboxResult(null);
    
    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "cipherpulse-sandbox",
          sender_id: "analyst.cipherpulse",
          sender_role: "Compliance Officer",
          team: "Internal Audit",
          channel_id: "compliance-pipeline",
          message_text: inputText
        })
      });
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setSandboxResult(data);
          setIsAnalyzing(false);
        }, 1200);
      } else {
        throw new Error("Local API offline");
      }
    } catch (e) {
      setTimeout(() => {
        const mockScore = inputText.toLowerCase().includes("meridian") || inputText.toLowerCase().includes("insider") || inputText.toLowerCase().includes("buy") ? 94.2 : 11.4;
        const mockLabels = mockScore > 50 ? ["MNPI"] : [];
        setSandboxResult({
          risk_score: mockScore,
          labels: mockLabels,
          explanation: { predicted_class: mockScore > 50 ? "MNPI" : "BENIGN", confidence: mockScore > 50 ? 0.942 : 0.895 },
          model_version: "v1-tfidf-lr"
        });
        setIsAnalyzing(false);
      }, 1000);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      color: '#0f172a', 
      fontFamily: '"Outfit", "Inter", sans-serif',
      overflowX: 'hidden'
    }}>
      <Navbar />

      <div style={{ flex: 1 }}>
        
        {/* HERO SECTION: Snowflake-style Clean Grid Canvas with Wavy Radial Contour Background */}
        <section style={{ 
          position: 'relative',
          padding: '120px 24px 100px 24px', 
          background: 'radial-gradient(100% 100% at 50% 0%, #f0f7fc 0%, #ffffff 70%)',
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {/* Wave/Contour Radiating Background lines (Pure CSS & SVG simulation) */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1800px',
            height: '800px',
            opacity: 0.6,
            backgroundImage: `radial-gradient(circle at 50% 0%, transparent 100px, rgba(41, 182, 246, 0.03) 101px, rgba(41, 182, 246, 0.03) 103px, transparent 104px,
              transparent 200px, rgba(41, 182, 246, 0.03) 201px, rgba(41, 182, 246, 0.03) 203px, transparent 204px,
              transparent 300px, rgba(41, 182, 246, 0.03) 301px, rgba(41, 182, 246, 0.03) 303px, transparent 304px,
              transparent 400px, rgba(41, 182, 246, 0.03) 401px, rgba(41, 182, 246, 0.03) 403px, transparent 404px,
              transparent 500px, rgba(41, 182, 246, 0.03) 501px, rgba(41, 182, 246, 0.03) 503px, transparent 504px,
              transparent 600px, rgba(41, 182, 246, 0.03) 601px, rgba(41, 182, 246, 0.03) 603px, transparent 604px,
              transparent 700px, rgba(41, 182, 246, 0.03) 701px, rgba(41, 182, 246, 0.03) 703px, transparent 704px)`,
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
            
            {/* Huge Premium Title with CODE - WORK Toggle */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '24px', 
              marginBottom: '28px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                fontSize: '84px', 
                fontWeight: '900', 
                color: '#29B6F6', 
                letterSpacing: '-3px',
                textShadow: '0 4px 20px rgba(41,182,246,0.15)'
              }}>
                CODE
              </span>

              {/* Dynamic Theme Toggle Pill Slider */}
              <button 
                onClick={() => setToggleMode(toggleMode === 'CODE' ? 'WORK' : 'CODE')}
                style={{
                  width: '110px',
                  height: '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 10px 25px rgba(0, 47, 86, 0.08)',
                  cursor: 'pointer',
                  padding: '5px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                title={`Switch to ${toggleMode === 'CODE' ? 'WORK' : 'CODE'} view mode`}
              >
                {/* Slidable glowing inner pill */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 10px rgba(41, 182, 246, 0.4)',
                  position: 'absolute',
                  left: toggleMode === 'CODE' ? '5px' : '59px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {toggleMode === 'CODE' ? <Code size={20} /> : <Layers size={20} />}
                </div>
                {/* Background micro icons */}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 10px', opacity: 0.3, pointerEvents: 'none' }}>
                  <Code size={16} />
                  <Layers size={16} />
                </div>
              </button>

              <span style={{ 
                fontSize: '84px', 
                fontWeight: '900', 
                color: '#5A6E85', 
                letterSpacing: '-3px'
              }}>
                WORK
              </span>
            </div>

            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#002F56', 
              marginBottom: '20px',
              fontFamily: '"Outfit", sans-serif'
            }}>
              A privacy-preserving, AI-powered communications surveillance platform
            </h2>

            <p style={{ 
              fontSize: '17px', 
              color: '#475569', 
              maxWidth: '680px', 
              margin: '0 auto 40px auto', 
              lineHeight: '1.6' 
            }}>
              Detect insider threats with CipherPulse Intelligence. Protect communication streams with Secure Compliance AI.<br />
              The enterprise confidential data cloud for secure regulated communications auditing.
            </p>

            {/* Premium Pill CTA buttons */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
              <button 
                onClick={() => setToggleMode('CODE')}
                className="btn-primary" 
                style={{ 
                  padding: '16px 36px', 
                  fontSize: '15px', 
                  backgroundColor: '#29B6F6', 
                  borderColor: '#29B6F6',
                  boxShadow: toggleMode === 'CODE' ? '0 10px 25px rgba(41, 182, 246, 0.4)' : 'none'
                }}
              >
                Discover CipherPulse AI
              </button>
              
              <button 
                onClick={() => setToggleMode('WORK')}
                className="btn-secondary" 
                style={{ 
                  padding: '16px 36px', 
                  fontSize: '15px',
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  color: '#002F56',
                  boxShadow: toggleMode === 'WORK' ? '0 10px 25px rgba(0, 47, 86, 0.08)' : 'none'
                }}
              >
                Meet Compliance Intelligence
              </button>
            </div>

            {/* HUGE HIGH-FIDELITY INTERACTIVE INTEGRATED WORKSPACE CONSOLE */}
            <div style={{
              width: '100%',
              maxWidth: '1150px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 47, 86, 0.08)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              zIndex: 10,
              position: 'relative',
              textAlign: 'left'
            }}>
              
              {/* SIDEBAR COMPONENT: Snowflake High-Fidelity styling adapted for CipherPulse */}
              <div style={{
                backgroundColor: '#0c1a2e',
                borderRight: '1px solid #1e293b',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                height: '620px',
                fontFamily: '"Inter", sans-serif'
              }}>
                {/* Sidebar Header */}
                <div style={{
                  padding: '24px 20px',
                  borderBottom: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <ShieldCheck size={16} color="#ffffff" strokeWidth={2.5} />
                  </div>
                  <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>
                    cipherpulse
                  </span>
                </div>

                {/* Sidebar Sections */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px' }}>
                  
                  {/* SECTION 1: Compliance Surveillance */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: '#475569', 
                      textTransform: 'uppercase', 
                      padding: '0 12px 8px 12px',
                      letterSpacing: '1px'
                    }}>
                      Surveillance AI
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {[
                        { name: 'Enclaves', icon: <Cpu size={15} /> },
                        { name: 'Message Streams', icon: <Network size={15} /> },
                        { name: 'Classification AI', icon: <Settings size={15} /> },
                        { name: 'Risk Analyzer', icon: <Zap size={15} />, highlight: true },
                        { name: 'Audit Logs', icon: <Activity size={15} /> },
                        { name: 'Escalate/Review', icon: <Layers size={15} /> },
                        { name: 'Regulators', icon: <DatabaseZap size={15} /> }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: item.highlight ? '#ffffff' : '#94a3b8',
                          backgroundColor: item.highlight ? 'rgba(41, 182, 246, 0.15)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if(!item.highlight) {
                            e.currentTarget.style.backgroundColor = '#1e293b';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if(!item.highlight) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                          }
                        }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {item.icon}
                            <span>{item.name}</span>
                          </div>
                          {item.highlight && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#29B6F6' }} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: Horizon Vault */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: '#475569', 
                      textTransform: 'uppercase', 
                      padding: '0 12px 8px 12px',
                      letterSpacing: '1px'
                    }}>
                      Horizon Vault
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {[
                        { name: 'Secure Archive', icon: <Database size={15} /> },
                        { name: 'Cryptographic attestation', icon: <FileCheck size={15} /> },
                        { name: 'Enclave Vaults', icon: <Lock size={15} /> }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          gap: '10px',
                          color: '#94a3b8',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e293b';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 3: Compute Nodes */}
                  <div>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: '#475569', 
                      textTransform: 'uppercase', 
                      padding: '0 12px 8px 12px',
                      letterSpacing: '1px'
                    }}>
                      Compute Nodes
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {[
                        { name: 'Intel SGX / Nitro', icon: <Cpu size={15} /> },
                        { name: 'DB Clusters', icon: <Database size={15} /> },
                        { name: 'System Config', icon: <Settings size={15} /> }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          gap: '10px',
                          color: '#94a3b8',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e293b';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sidebar Footer User Details */}
                <div style={{
                  padding: '16px',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#0a1526'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '800', color: '#29B6F6', border: '1px solid rgba(41,182,246,0.3)'
                    }}>
                      AK
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>ANUJ KUMAR</div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>CHIEF COMPLIANCE OFFICER</div>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <Bell size={16} />
                  </button>
                </div>

              </div>

              {/* MAIN CONTENT WORKSPACE: Switches based on CODE or WORK toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
                
                {toggleMode === 'CODE' ? (
                  // =================== CODE WORKVIEW: Terminals, Playgrounds, and Sandboxes ===================
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0b1329' }}>
                    
                    {/* Header bar */}
                    <div style={{
                      height: '56px',
                      backgroundColor: '#0f172a',
                      borderBottom: '1px solid #1e293b',
                      padding: '0 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#ffffff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={16} color="#29B6F6" />
                        <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', color: '#e2e8f0' }}>
                          CipherPulse Secure Worksheet v1.0.15
                        </span>
                      </div>
                      
                      {/* Active Connection state bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          NITRO_AWS_US_WEST_2
                        </span>
                        <span>Warehouse: SECURE_WH</span>
                        <span>Model: TFIDF_LR_v1</span>
                      </div>
                    </div>

                    {/* Terminal text layout */}
                    <div style={{ 
                      flex: 1, 
                      padding: '24px', 
                      fontFamily: '"JetBrains Mono", monospace', 
                      fontSize: '13px', 
                      color: '#e2e8f0', 
                      overflowY: 'auto',
                      lineHeight: '1.6'
                    }}>
                      {/* Technical Terminal Intro */}
                      <div style={{ color: '#64748b', marginBottom: '16px' }}>
                        * Ingesting secure database session credentials...<br />
                        * Establishing cryptographic VSOCK bridge to EC2 Hardware Enclave...<br />
                        * Active secure memory page address: 0x8F940B7E<br />
                        * Attestation Signature Status: SIGNATURE_OK (Intel SGX Certificate chains validated)
                      </div>

                      {/* Cool server detail block */}
                      <div style={{
                        backgroundColor: '#090f1d',
                        border: '1px solid #1e293b',
                        borderRadius: '6px',
                        padding: '16px',
                        marginBottom: '24px',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        gap: '24px',
                        color: '#94a3b8'
                      }}>
                        <div>
                          <span style={{ color: '#29B6F6', fontWeight: 'bold' }}>Agent Connections:</span><br />
                          DB Connection: POSTGRES_AWS_US_WEST_2<br />
                          Warehouse: COMPLIANCE_SECURE_WH<br />
                          Compute Engine: NITRO_VSOCK_V2
                        </div>
                        <div style={{ borderLeft: '1px solid #1e293b', paddingLeft: '24px', fontFamily: 'monospace', fontSize: '11px', color: '#cbd5e1' }}>
                          /Users/cipherpulse/compliance<br />
                          &gt; loaded 5 instruction files (ctrl+o to expand)<br />
                          &gt; classification engine online
                        </div>
                      </div>

                      {/* Interactive SQL editor section */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#29B6F6', marginBottom: '8px' }}>
                          <span>&gt; analyze communication payload for regulatory compliance risks</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#29B6F6', fontWeight: 'bold' }}>$</span>
                          <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type corporate communication or text payload to analyze risk..."
                            style={{
                              width: '100%',
                              height: '90px',
                              backgroundColor: '#0f172a',
                              border: '1px solid #1e293b',
                              borderRadius: '8px',
                              padding: '12px 12px 12px 28px',
                              color: '#ffffff',
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '13px',
                              resize: 'none',
                              outline: 'none',
                              lineHeight: '1.6',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>

                      {/* Play & Clear actions */}
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <button
                          onClick={handleSandboxAnalyze}
                          disabled={isAnalyzing}
                          style={{
                            backgroundColor: '#29B6F6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: '"Outfit", sans-serif',
                            boxShadow: '0 4px 10px rgba(41, 182, 246, 0.3)'
                          }}
                        >
                          {isAnalyzing ? <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} /> : <Play size={14} fill="#ffffff" />}
                          {isAnalyzing ? 'Analyzing Enclave Payload...' : 'Run Compliance Scan'}
                        </button>
                        
                        <button
                          onClick={() => setInputText("")}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#cbd5e1',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Clear payload input"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Compiler Sandbox Results */}
                      {isAnalyzing && (
                        <div style={{
                          border: '1px dashed rgba(41,182,246,0.3)',
                          borderRadius: '8px',
                          padding: '20px',
                          textAlign: 'center',
                          backgroundColor: '#090f1d',
                          color: '#29B6F6'
                        }}>
                          <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 10px auto' }} />
                          <div style={{ fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>
                            [ENCLAVE VM] DECRYPTING PAGE FRAME AND RUNNING LOGISTIC INFERENCE...
                          </div>
                        </div>
                      )}

                      {sandboxResult && !isAnalyzing && (
                        <div style={{
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          backgroundColor: '#090f1d',
                          padding: '16px',
                          fontFamily: 'monospace'
                        }}>
                          <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px', fontWeight: 'bold' }}>
                            ▶ OUTPUT STREAM ANALYSIS RESULT
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div>
                              <div style={{ color: '#64748b', fontSize: '11px' }}>RISK SCORE (0-100 TEE)</div>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: sandboxResult.risk_score > 50 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
                                {sandboxResult.risk_score.toFixed(2)}%
                              </div>
                            </div>
                            <div>
                              <div style={{ color: '#64748b', fontSize: '11px' }}>DETECTED VIOLATION</div>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>
                                {sandboxResult.labels.length > 0 ? sandboxResult.labels.join(", ") : "BENIGN (CLEAN)"}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: '#64748b', fontSize: '11px' }}>ATTESTATION PROOF</div>
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                <Shield size={14} /> SIGNED_NITRO_V1
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ borderTop: '1px solid #1e293b', marginTop: '12px', paddingTop: '8px', fontSize: '11px', color: '#475569' }}>
                            Model version: {sandboxResult.model_version} | Compute isolation: SECURE_HW_TEE_RAM | Latency: 4 ms
                          </div>
                        </div>
                      )}

                      {!sandboxResult && !isAnalyzing && (
                        <div style={{ color: '#475569', fontSize: '12px', fontStyle: 'italic', border: '1px dashed #1e293b', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                          Active waiting. Input text above and trigger "Run Compliance Scan" to see live cryptographic enclaved inference metrics.
                        </div>
                      )}

                    </div>

                  </div>
                ) : (
                  // =================== WORK WORKVIEW: Beautiful Widgets, Charts, and Analytics ===================
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                    
                    {/* Workspace Header */}
                    <div style={{
                      padding: '20px 24px',
                      borderBottom: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#002F56' }}>Compliance Operations Cloud</h3>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Live surveillance dashboards & metadata ledgers</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '9999px', border: '1px solid #d1fae5' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          SYSTEM_HEALTHY
                        </div>
                      </div>
                    </div>

                    {/* Operational Widget Dashboard Grid */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Metric cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,47,86,0.02)' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>Surveillance Ingestion Stream</div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#002F56', marginTop: '6px' }}>4,920,830</div>
                          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: 'bold' }}>+12.4% vs last week</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,47,86,0.02)' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>Active Enclave Nodes</div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#002F56', marginTop: '6px' }}>12 Active</div>
                          <div style={{ fontSize: '11px', color: '#00A3E0', marginTop: '4px', fontWeight: 'bold' }}>AWS Nitro VSOCK isolations</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,47,86,0.02)' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>Average Latency</div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#002F56', marginTop: '6px' }}>{pingTime} ms</div>
                          <div style={{ fontSize: '11px', color: '#8b5cf6', marginTop: '4px', fontWeight: 'bold' }}>High-throughput TEE</div>
                        </div>
                      </div>

                      {/* Main interactive chart simulation */}
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 4px rgba(0,47,86,0.02)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#002F56' }}>surveillance_scan_risk_scores_distribution</span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Real-time updates</span>
                        </div>
                        
                        {/* Custom visual chart drawing using CSS blocks */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid #cbd5e1' }}>
                          {[
                            { label: '00:00', height: 40 },
                            { label: '02:00', height: 60 },
                            { label: '04:00', height: 45 },
                            { label: '06:00', height: 90, highlight: true },
                            { label: '08:00', height: 110, highlight: true },
                            { label: '10:00', height: 75 },
                            { label: '12:00', height: 80 },
                            { label: '14:00', height: pingTime * 2 }
                          ].map((item, idx) => (
                            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '100%',
                                height: `${item.height}px`,
                                borderRadius: '4px 4px 0 0',
                                backgroundColor: item.highlight ? '#29B6F6' : '#cbd5e1',
                                transition: 'all 0.5s'
                              }} />
                              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Data Grid list details */}
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#002F56', marginBottom: '12px' }}>Surveillance Compliance Incidents Ledger</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                            { channel: 'compliance_audit_feed', user: 'trader_92', risk: '92.4%', label: 'MNPI Insider Trade', status: 'Flagged' },
                            { channel: 'public_slack_inbound', user: 'ops_specialist', risk: '12.1%', label: 'BENIGN', status: 'Clean' },
                            { channel: 'reuters_inbound', user: 'marketing_bot', risk: '8.4%', label: 'BENIGN', status: 'Clean' }
                          ].map((row, idx) => (
                            <div key={idx} style={{
                              display: 'grid',
                              gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr 1fr',
                              padding: '10px 16px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '12px',
                              alignItems: 'center'
                            }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#002F56' }}>#{row.channel}</span>
                              <span>{row.user}</span>
                              <span style={{ fontWeight: 'bold', color: parseFloat(row.risk) > 50 ? '#ef4444' : '#10b981' }}>{row.risk}</span>
                              <span style={{ color: parseFloat(row.risk) > 50 ? '#f59e0b' : '#64748b', fontWeight: 'bold' }}>{row.label}</span>
                              <span style={{
                                width: 'fit-content',
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: parseFloat(row.risk) > 50 ? '#ef4444' : '#10b981',
                                backgroundColor: parseFloat(row.risk) > 50 ? '#fef2f2' : '#ecfdf5',
                                border: parseFloat(row.risk) > 50 ? '1px solid #fee2e2' : '1px solid #d1fae5'
                              }}>{row.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* SECTION 2: SIMPLIFY ENTERPRISE DATA AND AI */}
        <section style={{ 
          padding: '100px 24px', 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #e2e8f0' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '80px', alignItems: 'center' }}>
            
            {/* Left: Beautiful detailed textual bullet columns with high-end icons */}
            <div>
              <span style={{ color: '#29B6F6', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
                Confidential Compliance AI
              </span>
              
              <h2 style={{ 
                fontSize: '44px', 
                fontWeight: '900', 
                color: '#002F56', 
                letterSpacing: '-1.5px',
                lineHeight: '1.1',
                marginBottom: '28px',
                fontFamily: '"Outfit", sans-serif'
              }}>
                surveillance compliance, mobilised completely.
              </h2>

              <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '40px' }}>
                CipherPulse establishes an unbreakable security perimeter around your data warehouse and surveillance pipelines. By isolating sensitive LLM inferences inside certified secure silicon RAM enclaves, corporate teams can monitor real-time security breaches with zero exposure.
              </p>

              {/* Iconized detailed list items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '8px',
                    backgroundColor: '#F4F9FC', border: '1px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#29B6F6', flexShrink: 0
                  }}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0' }}>Zero-Trust Enclave Isolation</h4>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      Never expose corporate intellectual property or PII content. Model classification is done inside secure EC2 AWS Nitro hardware enclaves with absolute isolation.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '8px',
                    backgroundColor: '#F4F9FC', border: '1px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#10b981', flexShrink: 0
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0' }}>Cryptographic Proof & Attestations</h4>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      Every database compliance audit report is cryptographically sealed, signed by secure silicon attestation certificates, ensuring absolute proof for regulators.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '8px',
                    backgroundColor: '#F4F9FC', border: '1px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8b5cf6', flexShrink: 0
                  }}>
                    <Network size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0' }}>High-Throughput Streaming & Auditing</h4>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      Audit hundreds of slack channels, trader messages, and reuters streams simultaneously. Scale enclaved instances in milliseconds to handle peak volume.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: High-Fidelity interactive visual metrics widget */}
            <div style={{
              backgroundColor: '#F4F9FC',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: 'inset 0 4px 10px rgba(0,47,86,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>surveillance_performance_metrics</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Active
                </span>
              </div>

              {/* Interactive Performance widget items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Metric 1 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span>ENCLAVE MODEL PREDICTION ACCURACY</span>
                    <span style={{ color: '#002F56' }}>98.6%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '98.6%', height: '100%', backgroundColor: '#29B6F6', borderRadius: '9999px' }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span>Surveillance Log Processing Rate</span>
                    <span style={{ color: '#002F56' }}>14.2k req/sec</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', backgroundColor: '#10b981', borderRadius: '9999px' }} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span>Cryptographic Verification Time</span>
                    <span style={{ color: '#002F56' }}>1.4 ms</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '12%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '9999px' }} />
                  </div>
                </div>

              </div>

              {/* Graphic schema visualizer box */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e6f7ff', color: '#29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={16} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#002F56' }}>Raw Data</span>
                </div>
                
                <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '32px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                    TEE
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#002F56' }}>Nitro Enclave</span>
                </div>

                <ChevronRight size={16} style={{ color: '#cbd5e1' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileCheck size={16} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#002F56' }}>Attestation</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3: SECURE SURVEILLANCE COMPLIANCE */}
        <section style={{ 
          padding: '100px 24px', 
          backgroundColor: '#F4F9FC', 
          borderBottom: '1px solid #e2e8f0' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            
            <span style={{ color: '#29B6F6', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              Consolidated Infrastructure
            </span>
            
            <h2 style={{ 
              fontSize: '44px', 
              fontWeight: '900', 
              color: '#002F56', 
              letterSpacing: '-1.5px',
              marginBottom: '48px',
              fontFamily: '"Outfit", sans-serif'
            }}>
              secure surveillance compliance. smash regulatory risk.
            </h2>

            {/* 4 grid columns details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px', marginBottom: '64px', textAlign: 'left' }}>
              
              {[
                { title: 'Data Ingestion', text: 'Real-time ingestion pipelines, direct database surveillance hooks, and secure Slack / Teams syncs.', color: '#29B6F6' },
                { title: 'AI Surveillance Core', text: 'Scikit-learn TF-IDF Vectorizer + Logistic Regression multi-class classifiers auditing scores 0-100.', color: '#10b981' },
                { title: 'Confidential Compute', text: 'Complete RAM page isolation using secure Intel SGX or AWS Nitro hardware enclaves.', color: '#8b5cf6' },
                { title: 'Attestation Ledger', text: 'Cryptographically signed audit logs proving model calculations integrity directly to regulators.', color: '#f59e0b' }
              ].map((card, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,47,86,0.01)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,47,86,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,47,86,0.01)';
                }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: card.color, marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>{card.title}</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{card.text}</p>
                </div>
              ))}

            </div>

            {/* TAB SELECTOR: Compliance Officer, Auditor, Developer, Risk Manager, Admin */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '6px',
              gap: '4px',
              marginBottom: '32px',
              boxShadow: '0 4px 10px rgba(0,47,86,0.02)'
            }}>
              {['Compliance Officer', 'Auditor', 'Developer', 'Risk Manager', 'Admin'].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: activeTab === tab ? '#002F56' : 'transparent',
                    color: activeTab === tab ? '#ffffff' : '#475569',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 20px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: '"Outfit", sans-serif'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* HIGH-FIDELITY PREVIEW SCREEN FOR ACTIVE TAB */}
            <div style={{
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,47,86,0.03)',
              padding: '28px',
              textAlign: 'left'
            }}>
              {activeTab === 'Developer' && (
                <div>
                  <h4 style={{ color: '#002F56', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800' }}>Surveillance API Ingestion & Custom Triggers</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                    Integrate real-time communications risk classifications into transactional PostgreSQL databases or backend APIs.
                  </p>
                  
                  <div style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '16px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }}>
                    <span style={{ color: '#94a3b8' }}># Trigger safe hardware enclave prediction using simple POST</span><br />
                    <span style={{ color: '#f59e0b' }}>import</span> requests<br />
                    url = <span style={{ color: '#10b981' }}>"http://localhost:8000/api/analyze"</span><br />
                    payload = &#123;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#29B6F6' }}>"message_text"</span>: <span style={{ color: '#10b981' }}>"I guarantee this investment will double your money by next week!"</span>,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#29B6F6' }}>"sender_role"</span>: <span style={{ color: '#10b981' }}>"Compliance specialist"</span><br />
                    &#125;<br />
                    res = requests.post(url, json=payload)<br />
                    print(res.json())
                  </div>
                </div>
              )}

              {activeTab === 'Compliance Officer' && (
                <div>
                  <h4 style={{ color: '#002F56', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800' }}>Human-in-the-Loop Surveillance Inbox</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                    Review, escalate, dismiss, or tag suspicious records with custom compliance explanations.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Unresolved Flags</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>42 Incidents</div>
                    </div>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Escalated to Legal</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>8 Incidents</div>
                    </div>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Reviewed & Dismissed</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>148 Incidents</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Auditor' && (
                <div>
                  <h4 style={{ color: '#002F56', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800' }}>Cryptographic Proofs & Attestation Registry</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                    Audit cryptographically signed verification records ensuring complete model execution integrity inside AWS TEE.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>✔ Attestation block signature #194057 validated</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>INTEL_SGX_SEAL_OK</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>✔ Attestation block signature #194058 validated</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>INTEL_SGX_SEAL_OK</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Risk Manager' && (
                <div>
                  <h4 style={{ color: '#002F56', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800' }}>Explainable AI Weight-Based Highlight Scoring</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                    Transparent explainability highlighting target keywords (MNPI, Guaranteed Returns, Collusion) that triggered the flag.
                  </p>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc', fontSize: '14px', lineHeight: '1.6' }}>
                    "I <span style={{ backgroundColor: '#fed7aa', color: '#ea580c', fontWeight: 'bold', padding: '2px 4px', borderRadius: '4px' }}>guarantee</span> this investment will <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 'bold', padding: '2px 4px', borderRadius: '4px' }}>double</span> your money by next week!"
                  </div>
                </div>
              )}

              {activeTab === 'Admin' && (
                <div>
                  <h4 style={{ color: '#002F56', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800' }}>Secure TEE AWS Nitro Enclave isolation configuration</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                    Provision dedicated CPU core isolations and secure address spaces.
                  </p>
                  <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '12px' }}>
                    nitro-cli run-enclave --cpu-count 4 --memory 8192 --enclave-cid 16
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* LOGOS GRID SECTION */}
        <section style={{ padding: '64px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '32px' }}>
              TRUSTED BY LEADERS IN ENTERPRISE COMPLIANCE
            </span>
            
            {/* Horizontal grid rows */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '40px' 
            }}>
              {['Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Citigroup', 'BlackRock', 'Roku'].map((logo, idx) => (
                <div 
                  key={idx}
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#cbd5e1',
                    letterSpacing: '-1.5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#29B6F6';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(41,182,246,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: THE COMPLIANCE ECOSYSTEM */}
        <section style={{ padding: '100px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{ color: '#29B6F6', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
                Infinite Integrations
              </span>
              <h2 style={{ fontSize: '44px', fontWeight: '900', color: '#002F56', letterSpacing: '-1.5px', fontFamily: '"Outfit", sans-serif' }}>
                the compliance data ecosystem.
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0 auto' }}>
                Securely stream and query compliance files from any major cloud repository or chat collaboration service instantly.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
              
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e6f7ff', color: '#29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Database size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>Postgres & SQL Syncs</h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  Directly connect transactional ledgers and audit records. Automate model scans using simple database procedures.
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Terminal size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>Surveillance Webhooks</h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  Setup immediate webhook listeners. Stream conversations from corporate chat tools directly to secure hardware enclaves.
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <ShieldCheck size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>AWS Nitro Attestations</h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  Direct hardware-level integration ensuring that no cloud operator or OS user can view raw memory pages.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* BLUE CTA BLOCK BANNER: "WHERE COMPLIANCE MEETS ABSOLUTE CONFIDENTIALITY" */}
        <section style={{
          backgroundColor: '#00A3E0',
          backgroundImage: 'linear-gradient(135deg, #00A3E0 0%, #29B6F6 100%)',
          color: '#ffffff',
          padding: '80px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle logo vector outline behind CTA banner */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
            <h2 style={{ 
              fontSize: '44px', 
              fontWeight: '900', 
              marginBottom: '20px', 
              letterSpacing: '-1.5px',
              fontFamily: '"Outfit", sans-serif'
            }}>
              where compliance meets absolute confidentiality.
            </h2>
            
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Gain absolute compliance certainty without compromising raw intellectual privacy. Get started today.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/inbox" 
                style={{ 
                  color: '#002F56', 
                  backgroundColor: '#ffffff',
                  fontWeight: '700', 
                  padding: '16px 36px', 
                  borderRadius: '9999px',
                  fontSize: '15px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,47,86,0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Start for free
              </Link>
              
              <Link 
                to="/inbox" 
                style={{ 
                  color: '#ffffff', 
                  border: '1px solid #ffffff',
                  fontWeight: '700', 
                  padding: '16px 32px', 
                  borderRadius: '9999px',
                  fontSize: '15px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
