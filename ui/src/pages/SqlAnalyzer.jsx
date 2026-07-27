import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../api/client';
import { 
  Database, 
  Play, 
  Trash2, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Table, 
  Info, 
  Terminal, 
  CheckCircle, 
  AlertCircle,
  FileCode
} from 'lucide-react';

const SqlAnalyzer = () => {
  // Workbench SQL Editor Query
  const [query, setQuery] = useState(
    'SELECT r.team, count(*) as alert_count, round(avg(s.risk_score)::numeric, 1) as avg_risk\nFROM communications_raw r\nJOIN communications_scored s ON r.id = s.raw_id\nWHERE s.risk_score >= 60\nGROUP BY r.team\nORDER BY alert_count DESC;'
  );
  
  // Results and logs state
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('results'); // 'results' or 'logs'
  const [logs, setLogs] = useState([
    {
      time: new Date().toLocaleTimeString(),
      action: 'Connect to PostgreSQL server at cipherpulse_dev',
      message: 'Connection successful. Database engine ready.',
      duration: '0.005s',
      status: 'success'
    }
  ]);

  // Schema tree state (collapsed/expanded)
  const [schemaExpanded, setSchemaExpanded] = useState(true);
  const [tablesExpanded, setTablesExpanded] = useState(true);
  const [expandedTables, setExpandedTables] = useState({
    communications_raw: false,
    communications_scored: false,
    compliance_reviews: false
  });

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sync scrolling of line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generate line numbers based on the query text
  const lineCount = query.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 8) }, (_, i) => i + 1);

  // Execute query handler
  const handleRunQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);
    setActiveTab('results');

    const startTime = performance.now();
    const currentTime = new Date().toLocaleTimeString();

    try {
      const response = await api.executeSql(query);
      const durationMs = (performance.now() - startTime).toFixed(1);
      
      setResults(response.data);
      
      // Append successful log
      setLogs(prev => [
        {
          time: currentTime,
          action: query.trim().replace(/\n/g, ' '),
          message: `${response.data.count} row(s) returned`,
          duration: `${(durationMs / 1000).toFixed(3)}s`,
          status: 'success'
        },
        ...prev
      ]);
    } catch (err) {
      const durationMs = (performance.now() - startTime).toFixed(1);
      const errMsg = err.response?.data?.detail || 'An unexpected error occurred during database query execution.';
      setError(errMsg);
      
      // Append error log
      setLogs(prev => [
        {
          time: currentTime,
          action: query.trim().replace(/\n/g, ' '),
          message: `Error: ${errMsg}`,
          duration: `${(durationMs / 1000).toFixed(3)}s`,
          status: 'error'
        },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    textareaRef.current?.focus();
  };

  const handleExportCsv = () => {
    if (!results || results.rows.length === 0) return;
    
    // Convert to RFC-4180 CSV
    const headers = results.columns.join(',');
    const rows = results.rows.map(row => 
      results.columns.map(col => {
        const val = row[col] === null ? '' : String(row[col]);
        return val.includes(',') || val.includes('"') || val.includes('\n') 
          ? `"${val.replace(/"/g, '""')}"` 
          : val;
      }).join(',')
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cipherpulse_query_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle tree elements
  const toggleTableExpand = (table) => {
    setExpandedTables(prev => ({
      ...prev,
      [table]: !prev[table]
    }));
  };

  const setQueryTemplate = (sql) => {
    setQuery(sql);
  };

  const schemaInfo = {
    communications_raw: ['id', 'source', 'timestamp', 'sender_id', 'sender_role', 'team', 'channel_id', 'message_text', 'is_flagged', 'flag_reason'],
    communications_scored: ['id', 'raw_id', 'risk_score', 'labels', 'explanation', 'model_version', 'scored_at'],
    compliance_reviews: ['id', 'raw_id', 'review_status', 'feedback', 'reviewed_by', 'reviewed_at']
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <Sidebar />

      {/* MySQL Workbench Layout Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* IDE Title / Top Bar */}
        <div style={{
          height: '42px',
          backgroundColor: '#e5e7eb',
          borderBottom: '1px solid #d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color="#475569" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>MySQL Workbench - Local Connection @ cipherpulse_dev</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#6b7280', borderRight: '1px solid #cbd5e1', paddingRight: '12px' }}>host: 127.0.0.1 | port: 5432</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Connected
            </span>
          </div>
        </div>

        {/* Main Split Panels: Left Navigator + Right Editor */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          
          {/* Left Panel: Schema Navigator */}
          <div style={{
            width: '250px',
            backgroundColor: '#f9fafb',
            borderRight: '1px solid #d1d5db',
            display: 'flex',
            flexDirection: 'column',
            fontSize: '12px',
            color: '#374151',
            flexShrink: 0,
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#e5e7eb',
              borderBottom: '1px solid #d1d5db',
              fontWeight: '700',
              color: '#4b5563',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Navigator: Schemas
            </div>

            {/* Tree Root */}
            <div style={{ padding: '12px' }}>
              <div 
                onClick={() => setSchemaExpanded(!schemaExpanded)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px' }}
              >
                {schemaExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Database size={14} color="#0284c7" />
                <span>cipherpulse</span>
              </div>

              {schemaExpanded && (
                <div style={{ paddingLeft: '16px' }}>
                  {/* Tables Folder */}
                  <div 
                    onClick={() => setTablesExpanded(!tablesExpanded)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '6px', color: '#4b5563' }}
                  >
                    {tablesExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Folder size={14} color="#eab308" />
                    <span style={{ fontWeight: '600' }}>Tables</span>
                  </div>

                  {tablesExpanded && (
                    <div style={{ paddingLeft: '16px' }}>
                      {Object.keys(schemaInfo).map((table) => {
                        const isExp = expandedTables[table];
                        return (
                          <div key={table} style={{ marginBottom: '6px' }}>
                            {/* Table Item */}
                            <div 
                              onClick={() => toggleTableExpand(table)}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#1f2937' }}
                              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                              {isExp ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                              <Table size={12} color="#0ea5e9" />
                              <span>{table}</span>
                            </div>

                            {/* Column Children */}
                            {isExp && (
                              <div style={{ paddingLeft: '14px', marginTop: '3px', borderLeft: '1px dotted #cbd5e1', marginLeft: '5px' }}>
                                {schemaInfo[table].map((col) => (
                                  <div key={col} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 0', color: '#6b7280', fontSize: '11px' }}>
                                    <span style={{ color: '#94a3b8' }}>🔹</span>
                                    <span>{col}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Templates Drawer inside navigator */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #d1d5db', padding: '12px' }}>
              <span style={{ fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase' }}>Quick Query Bookmarks</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button 
                  onClick={() => setQueryTemplate('SELECT * FROM communications_raw LIMIT 10;')}
                  style={{ textAlign: 'left', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px', cursor: 'pointer', fontSize: '11px' }}
                >
                  📄 Select All Raw
                </button>
                <button 
                  onClick={() => setQueryTemplate('SELECT label, count(*) FROM (SELECT unnest(labels) as label FROM communications_scored) s GROUP BY label;')}
                  style={{ textAlign: 'left', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px', cursor: 'pointer', fontSize: '11px' }}
                >
                  📊 Alert Labels Summary
                </button>
                <button 
                  onClick={() => setQueryTemplate('SELECT r.sender_id, s.risk_score FROM communications_raw r JOIN communications_scored s ON r.id = s.raw_id WHERE s.risk_score >= 80;')}
                  style={{ textAlign: 'left', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px', cursor: 'pointer', fontSize: '11px' }}
                >
                  🚨 High Violations Sender list
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Editor + Toolbar + Bottom Split Results Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#ffffff' }}>
            
            {/* Editor Toolbar */}
            <div style={{
              height: '38px',
              backgroundColor: '#f3f4f6',
              borderBottom: '1px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
              gap: '6px',
              flexShrink: 0
            }}>
              {/* Execute Button */}
              <button 
                onClick={handleRunQuery}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1e293b',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#eff6ff')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <Play size={12} color="#fbbf24" fill="#fbbf24" />
                <span style={{ color: '#0f172a' }}>{loading ? 'Running...' : 'Execute'}</span>
              </button>

              {/* Clear Editor */}
              <button 
                onClick={handleClear}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <Trash2 size={12} color="#ef4444" />
                <span>Clear</span>
              </button>

              <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1', margin: '0 6px' }} />

              {/* Export Grid to CSV */}
              <button 
                onClick={handleExportCsv}
                disabled={!results || results.rows.length === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: results && results.rows.length > 0 ? '#ffffff' : '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: results && results.rows.length > 0 ? '#10b981' : '#94a3b8',
                  cursor: !results || results.rows.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <Download size={12} />
                <span>Export Grid</span>
              </button>
            </div>

            {/* SQL Editor Area (Textarea with line numbers side-by-side) */}
            <div style={{
              flex: 1,
              display: 'flex',
              minHeight: '150px',
              maxHeight: '40%',
              borderBottom: '4px solid #cbd5e1',
              overflow: 'hidden',
              backgroundColor: '#fafafa'
            }}>
              {/* Line Numbers gutter */}
              <div 
                ref={lineNumbersRef}
                style={{
                  width: '42px',
                  backgroundColor: '#f1f5f9',
                  borderRight: '1px solid #e2e8f0',
                  padding: '14px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  paddingRight: '8px',
                  userSelect: 'none',
                  overflow: 'hidden',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '13px',
                  color: '#94a3b8',
                  lineHeight: '20px'
                }}
              >
                {lineNumbers.map(n => (
                  <div key={n} style={{ height: '20px' }}>{n}</div>
                ))}
              </div>

              {/* Actual Textarea Code Editor */}
              <textarea 
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onScroll={handleScroll}
                placeholder="/* Write SELECT query scripts here */"
                spellCheck="false"
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '14px',
                  margin: 0,
                  backgroundColor: 'transparent',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '13px',
                  color: '#0f172a',
                  lineHeight: '20px',
                  outline: 'none',
                  resize: 'none',
                  overflowY: 'auto',
                  whiteSpace: 'pre',
                  tabSize: 4
                }}
              />
            </div>

            {/* Bottom Split: Tabbed Panel (Results Grid / Execution Logs) */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: '#ffffff' }}>
              
              {/* Tabs list bar */}
              <div style={{
                height: '32px',
                backgroundColor: '#f3f4f6',
                borderBottom: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'flex-end',
                paddingLeft: '16px',
                flexShrink: 0
              }}>
                <button 
                  onClick={() => setActiveTab('results')}
                  style={{
                    padding: '4px 16px 6px 16px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: '1px solid #cbd5e1',
                    borderBottom: activeTab === 'results' ? '1px solid #ffffff' : '1px solid #cbd5e1',
                    backgroundColor: activeTab === 'results' ? '#ffffff' : '#e5e7eb',
                    borderRadius: '4px 4px 0 0',
                    cursor: 'pointer',
                    color: activeTab === 'results' ? '#1d4ed8' : '#4b5563',
                    marginBottom: '-1px',
                    zIndex: 10
                  }}
                >
                  Result Grid
                </button>
                <button 
                  onClick={() => setActiveTab('logs')}
                  style={{
                    padding: '4px 16px 6px 16px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: '1px solid #cbd5e1',
                    borderBottom: activeTab === 'logs' ? '1px solid #ffffff' : '1px solid #cbd5e1',
                    backgroundColor: activeTab === 'logs' ? '#ffffff' : '#e5e7eb',
                    borderRadius: '4px 4px 0 0',
                    cursor: 'pointer',
                    color: activeTab === 'logs' ? '#1d4ed8' : '#4b5563',
                    marginLeft: '4px',
                    marginBottom: '-1px',
                    zIndex: 10
                  }}
                >
                  Execution Logs
                </button>
              </div>

              {/* Tab Contents */}
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
                {/* 1. Results Grid View */}
                {activeTab === 'results' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {results ? (
                      <div style={{ flex: 1, overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
                        {results.count === 0 ? (
                          <div style={{ padding: '40px', color: '#6b7280', fontSize: '13px', textAlign: 'center' }}>
                            Query executed successfully: returned 0 rows.
                          </div>
                        ) : (
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', borderLeft: 'none', borderRight: 'none' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #d1d5db', position: 'sticky', top: 0, zIndex: 5 }}>
                                {/* Row indices count gutter */}
                                <th style={{ width: '40px', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #d1d5db', padding: '6px 10px', backgroundColor: '#e5e7eb', color: '#4b5563', textAlign: 'center', fontWeight: '500' }}>#</th>
                                {results.columns.map((col) => (
                                  <th key={col} style={{ borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #d1d5db', padding: '6px 12px', color: '#374151', fontWeight: '700', textTransform: 'lowercase', backgroundColor: '#f1f5f9' }}>
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {results.rows.map((row, rIdx) => (
                                <tr key={rIdx} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                  {/* Row Index Gutter */}
                                  <td style={{ backgroundColor: '#f3f4f6', borderRight: '1px solid #cbd5e1', padding: '6px 10px', color: '#94a3b8', textAlign: 'center', fontFamily: 'monospace' }}>
                                    {rIdx + 1}
                                  </td>
                                  {results.columns.map((col) => (
                                    <td key={col} style={{ borderRight: '1px solid #cbd5e1', padding: '6px 12px', color: '#111827', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '300px' }}>
                                      {row[col] !== null ? String(row[col]) : <span style={{ color: '#d1d5db', fontStyle: 'italic' }}>NULL</span>}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ) : error ? (
                      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertTriangle size={16} />
                        <strong>Error:</strong> {error}
                      </div>
                    ) : loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px', gap: '10px', color: '#2563eb' }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid #eff6ff',
                          borderTop: '2px solid #2563eb',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Executing SELECT query remotely...</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px', gap: '10px', color: '#94a3b8' }}>
                        <Info size={28} />
                        <span style={{ fontSize: '12px' }}>Workbench ready. Enter SELECT command or click templates to run queries.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Database Logs View */}
                {activeTab === 'logs' && (
                  <div style={{ flex: 1, padding: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left', fontFamily: 'monospace' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                          <th style={{ padding: '6px 8px', width: '90px' }}>Time</th>
                          <th style={{ padding: '6px 8px', width: '250px' }}>Action / SQL Statement</th>
                          <th style={{ padding: '6px 8px' }}>Response Message</th>
                          <th style={{ padding: '6px 8px', width: '80px', textAlign: 'right' }}>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', color: log.status === 'error' ? '#ef4444' : '#1e293b' }}>
                            <td style={{ padding: '6px 8px', color: '#94a3b8' }}>{log.time}</td>
                            <td style={{ padding: '6px 8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }} title={log.action}>
                              {log.action}
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              {log.status === 'error' ? '❌ ' : '✅ '}{log.message}
                            </td>
                            <td style={{ padding: '6px 8px', textAlign: 'right', color: '#64748b' }}>{log.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlAnalyzer;
