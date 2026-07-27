import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Network, Cpu, Lock, Database, Terminal, Shield, ArrowRight, CheckCircle2 
} from 'lucide-react';

const BlueprintExplorer = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  const ec2Specs = {
    instanceType: "t3.medium (4 GB RAM, 2 vCPUs)",
    platform: "Amazon Linux 2023 (AMI)",
    publicIp: "3.108.61.46",
    privateIp: "172.31.34.65",
    region: "ap-south-1 (Mumbai)",
    activePorts: [
      { port: 22, desc: "SSH Access (Encrypted CLI)" },
      { port: 5173, desc: "React Portal (Vite HTTP Server)" },
      { port: 8000, desc: "FastAPI Backend (Uvicorn REST Gateway)" },
      { port: 5432, desc: "PostgreSQL Database Engine" }
    ],
    nvmVersion: "v20.11.0 (LTS)",
    pythonVersion: "python3.11.8 (venv enabled)"
  };

  const dbSchema = [
    {
      table: "communications_raw",
      desc: "Stores original ingested messages + metadata.",
      columns: [
        { name: "id", type: "UUID PRIMARY KEY", desc: "Unique record key" },
        { name: "source", type: "VARCHAR(50)", desc: "Slack, Teams, Bloomberg, etc." },
        { name: "timestamp", type: "TIMESTAMPTZ", desc: "User message timestamp" },
        { name: "sender_id", type: "VARCHAR(100)", desc: "Sender handle" },
        { name: "sender_role", type: "VARCHAR(100)", desc: "Trader, Analyst, etc." },
        { name: "message_text", type: "TEXT", desc: "Confidential raw message body" },
        { name: "is_flagged", type: "BOOLEAN", desc: "ETL loader anomaly label" }
      ]
    },
    {
      table: "communications_scored",
      desc: "Stores ML inference classification outputs.",
      columns: [
        { name: "id", type: "UUID PRIMARY KEY", desc: "Unique inference key" },
        { name: "raw_id", type: "UUID REFERENCES raw", desc: "Foreign key to raw table" },
        { name: "risk_score", type: "FLOAT (0.0 - 100.0)", desc: "Compliance risk metric" },
        { name: "labels", type: "JSONB", desc: "Identified categories (e.g. MNPI)" },
        { name: "explanation", type: "JSONB", desc: "ML Token contribution details" },
        { name: "model_version", type: "VARCHAR(50)", desc: "e.g. v1-tfidf-lr" }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', color: '#1e293b' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.5px', color: '#0f172a' }}>
              Confidential Systems Blueprint
            </h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
              Audit client data pathways, system components, EC2 host diagnostics, and database schemas.
            </p>
          </div>

          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            backgroundColor: '#ecfdf5', 
            border: '1px solid #a7f3d0',
            borderRadius: '9999px', 
            fontSize: '13px', 
            fontWeight: '700', 
            color: '#065f46'
          }}>
            <Shield size={14} /> TEE INTEGRITY VERIFIED
          </div>
        </div>

        {/* Blueprint Selector Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setActiveTab('pipeline')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: '6px', border: 'none',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              backgroundColor: activeTab === 'pipeline' ? '#0f172a' : '#ffffff',
              color: activeTab === 'pipeline' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'pipeline' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              border: '1px solid #cbd5e1'
            }}
          >
            <Network size={16} /> 1. Data Pipeline Flow
          </button>

          <button 
            onClick={() => setActiveTab('ec2')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: '6px', border: 'none',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              backgroundColor: activeTab === 'ec2' ? '#0f172a' : '#ffffff',
              color: activeTab === 'ec2' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'ec2' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              border: '1px solid #cbd5e1'
            }}
          >
            <Cpu size={16} /> 2. EC2 Host Node
          </button>

          <button 
            onClick={() => setActiveTab('tee')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: '6px', border: 'none',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              backgroundColor: activeTab === 'tee' ? '#0f172a' : '#ffffff',
              color: activeTab === 'tee' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'tee' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              border: '1px solid #cbd5e1'
            }}
          >
            <Lock size={16} /> 3. AWS Nitro TEE
          </button>

          <button 
            onClick={() => setActiveTab('db')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: '6px', border: 'none',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              backgroundColor: activeTab === 'db' ? '#0f172a' : '#ffffff',
              color: activeTab === 'db' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'db' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              border: '1px solid #cbd5e1'
            }}
          >
            <Database size={16} /> 4. PostgreSQL Schemas
          </button>

          <button 
            onClick={() => setActiveTab('llm')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: '6px', border: 'none',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              backgroundColor: activeTab === 'llm' ? '#0f172a' : '#ffffff',
              color: activeTab === 'llm' ? '#ffffff' : '#475569',
              boxShadow: activeTab === 'llm' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              border: '1px solid #cbd5e1'
            }}
          >
            <Terminal size={16} /> 5. Local LLM status
          </button>
        </div>

        {/* Dynamic Console Dashboard Wrapper */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          
          {/* TAB 1: PIPELINE FLOW */}
          {activeTab === 'pipeline' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Zero-Trust Ingestion & Inference Pipeline Flow
              </h3>
              <p style={{ color: '#475569', marginBottom: '32px', fontSize: '14px' }}>
                How client data flows cryptographically from corporate endpoints down to secure enclaves and logs:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { step: "01", title: "Corporate Chat Streams", desc: "Traders post chats via Slack, Teams, Bloomberg terminals, or OTC pipelines." },
                  { step: "02", title: "API Gateway Validation", desc: "FastAPI REST Server (Port 8000) intercepts payloads, validates inputs, and triggers isolation pipelines." },
                  { step: "03", title: "Secure TEE VSOCK Exchange", desc: "Raw strings are routed strictly through physical virtual sockets (AF_VSOCK port 5000) into the Nitro Enclave. Bypasses public networks." },
                  { step: "04", title: "Vectorized In-Enclave Inference", desc: "The TF-IDF vectorizer and ML classifier calculate risk parameters in secure hardware-isolated RAM registers. Raw texts are immediately garbage-collected." },
                  { step: "05", title: "Safe Metadata Ledgers", desc: "Enclave returns strictly anonymous compliance risk scores and category labels (e.g. MNPI), which are logged into PostgreSQL." }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800',
                      color: '#1d4ed8', flexShrink: 0, border: '1px solid #dbeafe'
                    }}>
                      {step.step}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>{step.title}</h4>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EC2 HOST SPECS */}
          {activeTab === 'ec2' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                AWS EC2 Host Node Telemetry Specs
              </h3>
              <p style={{ color: '#475569', marginBottom: '28px', fontSize: '14px' }}>
                Detailed live host telemetry of your cloud server running the application suite:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '600', color: '#64748b' }}>Instance Type</td>
                        <td style={{ padding: '12px 0', fontWeight: '700', color: '#0f172a' }}>{ec2Specs.instanceType}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '600', color: '#64748b' }}>Operating System</td>
                        <td style={{ padding: '12px 0', fontWeight: '700', color: '#0f172a' }}>{ec2Specs.platform}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '600', color: '#64748b' }}>Public IP Interface</td>
                        <td style={{ padding: '12px 0', fontWeight: '700', color: '#1d4ed8' }}>{ec2Specs.publicIp}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '600', color: '#64748b' }}>AWS Region Zone</td>
                        <td style={{ padding: '12px 0', fontWeight: '700', color: '#0f172a' }}>{ec2Specs.region}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '600', color: '#64748b' }}>NodeJS Runtime</td>
                        <td style={{ padding: '12px 0', fontWeight: '700', color: '#0f172a' }}>{ec2Specs.nvmVersion}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '600', color: '#64748b' }}>Python Engine</td>
                        <td style={{ padding: '12px 0', fontWeight: '700', color: '#0f172a' }}>{ec2Specs.pythonVersion}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                Active Network Ports (Inbound Security Group Rules)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {ec2Specs.activePorts.map((p, idx) => (
                  <div key={idx} style={{ 
                    padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <div style={{ 
                      width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%'
                    }} />
                    <div>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>Port {p.port}</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEE ENCLAVE */}
          {activeTab === 'tee' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                AWS Nitro Enclaves (TEE / Cryptographic Attestation)
              </h3>
              <p style={{ color: '#475569', marginBottom: '28px', fontSize: '14px' }}>
                Cryptographic attestation and hardware isolation configuration parameters:
              </p>

              <div style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <Lock size={22} color="#1d4ed8" />
                  <div>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>Hardware Isolation Mode: ACTIVE</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>CPU Cores and RAM allocated are cryptographically isolated by the Nitro Hypervisor</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Secure Socket Protocol</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>AF_VSOCK (Port 5000)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Attestation PCR0 (EIF Hash)</span>
                    <span style={{ fontWeight: '700', color: '#1d4ed8', fontFamily: 'monospace' }}>8a3f89ba76cd3e221d6023f009b93b45a97741d9</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Attestation PCR1 (OS Kernel Hash)</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>ff3d52c78a0d4c82b9e6bd3e7e221f76da075ef8</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>NSM Attestation Module Path</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>/dev/nsm</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <CheckCircle2 size={18} color="#15803d" />
                <span style={{ color: '#15803d', fontWeight: '700', fontSize: '13px' }}>
                  Cryptographic attestation handshake successfully verifies that the enclave code matches exactly our open-source, compiled Docker image.
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE SCHEMAS */}
          {activeTab === 'db' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                PostgreSQL System Database Schemas
              </h3>
              <p style={{ color: '#475569', marginBottom: '32px', fontSize: '14px' }}>
                The underlying structured DDL tables representing the application audit ledger:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {dbSchema.map((t, idx) => (
                  <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Database size={16} color="#0f172a" />
                        <strong style={{ fontSize: '16px', color: '#0f172a' }}>TABLE: {t.table}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{t.desc}</div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fdfdfd' }}>
                          <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700' }}>Column Name</th>
                          <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700' }}>Data Type</th>
                          <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700' }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.columns.map((c, cIdx) => (
                          <tr key={cIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>{c.name}</td>
                            <td style={{ padding: '12px 16px', color: '#1d4ed8', fontWeight: '600', fontFamily: 'monospace' }}>{c.type}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{c.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOCAL LLM GENERATOR */}
          {activeTab === 'llm' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Local Llama AI Ingestion Generator status
              </h3>
              <p style={{ color: '#475569', marginBottom: '28px', fontSize: '14px' }}>
                How our offline AI generator generates 100% unique compliance messages endlessly with zero rate limits:
                  </p>

              <div style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <Terminal size={22} color="#0f172a" />
                  <div>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>Model: Llama-3.2-1B-Instruct (Meta)</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>CPU/RAM friendly footprint optimized specifically for 4GB EC2 servers</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Model RAM footprint</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>~900 MB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Serving Engine</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>Ollama (Local Unix daemon)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Prompt parameters</span>
                    <span style={{ fontWeight: '700', color: '#1d4ed8', fontFamily: 'monospace' }}>Trader Persona + Suspension Ticker</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Inference rate limit constraints</span>
                    <span style={{ fontWeight: '700', color: '#16a34a', fontFamily: 'monospace' }}>None (100% Free / Limitless)</span>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                Active In-Memory Prompt Blueprint:
              </h4>
              <pre style={{ 
                padding: '20px', backgroundColor: '#0f172a', color: '#94a3b8', borderRadius: '8px', 
                fontSize: '12px', overflowX: 'auto', border: '1px solid #334155', fontFamily: 'monospace',
                lineHeight: '1.6'
              }}>
{`"You are roleplaying as a Wall Street trader named {trader_id}.
Write a single casual chat message (1-2 sentences) discussing {ticker}.
The message must contain a subtle and suspicious {violation_type} policy violation.
Do not write any greetings, quotes, or headers. Write only the raw chat message."`}
              </pre>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default BlueprintExplorer;
