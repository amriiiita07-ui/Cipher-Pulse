import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../api/client';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Clock,
  ArrowUpDown
} from 'lucide-react';

const Analysis = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [labelFilter, setLabelFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  
  // Sort state
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch with min_score=0 and a large limit to query all messages
        const response = await api.getAlerts({ min_score: 0, limit: 500 });
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching scored messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // ─── Filter & Search Logic ──────────────────────────────────────────────────
  const getRiskRange = (score) => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'MINOR';
    return 'LOW';
  };

  const getPrimaryLabel = (msg) => {
    return msg.labels && msg.labels.length > 0 ? msg.labels[0] : 'BENIGN';
  };

  const filteredMessages = messages.filter((msg) => {
    const primaryLabel = getPrimaryLabel(msg);
    const riskRange = getRiskRange(msg.risk_score);
    
    const matchesSearch = 
      msg.message_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.sender_id && msg.sender_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.raw_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLabel = labelFilter === 'ALL' || primaryLabel === labelFilter;
    const matchesRisk = riskFilter === 'ALL' || riskRange === riskFilter;

    return matchesSearch && matchesLabel && matchesRisk;
  });

  // ─── Sort Logic ─────────────────────────────────────────────────────────────
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'primary_label') {
      aVal = getPrimaryLabel(a);
      bVal = getPrimaryLabel(b);
    }

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  // ─── Pagination Logic ──────────────────────────────────────────────────────
  const totalItems = sortedMessages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMessages.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // ─── CSV Export Action ──────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredMessages.length === 0) return;

    const headers = [
      'Message ID',
      'Timestamp',
      'Source',
      'Sender ID',
      'Sender Role',
      'Team',
      'Risk Score',
      'Primary Label',
      'Review Status',
      'Raw Text'
    ];

    const rows = filteredMessages.map((msg) => [
      msg.raw_id,
      msg.timestamp,
      msg.source,
      msg.sender_id || 'Unknown',
      msg.sender_role || 'Unknown',
      msg.team || 'Unknown',
      msg.risk_score.toFixed(1),
      getPrimaryLabel(msg),
      msg.review_status || 'Unreviewed',
      // Clean raw text to prevent breaking CSV structure
      `"${msg.message_text.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cipherpulse_compliance_analysis_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Severity color helpers
  const getSeverityStyle = (range) => {
    switch (range) {
      case 'CRITICAL':
        return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'HIGH':
        return { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' };
      case 'MEDIUM':
        return { color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.15)' };
      case 'MINOR':
        return { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' };
      default:
        return { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' };
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.5px', color: '#0f172a' }}>Scored Analysis Registry</h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>Detailed breakdown and audit ledger of all analyzed transaction communications</p>
          </div>
          
          <button
            onClick={handleExportCSV}
            disabled={filteredMessages.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '12px 20px',
              color: '#0f172a',
              fontSize: '14px',
              fontWeight: '600',
              cursor: filteredMessages.length === 0 ? 'not-allowed' : 'pointer',
              opacity: filteredMessages.length === 0 ? 0.5 : 1,
              transition: 'background-color 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => { if (filteredMessages.length > 0) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            <Download size={16} /> Export to CSV
          </button>
        </div>

        {/* Filters Panel */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '20px',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by ID, sender, or keyword..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Label Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}><Filter size={14} style={{ display: 'inline', marginRight: '4px' }}/> Label:</span>
            <select
              value={labelFilter}
              onChange={(e) => { setLabelFilter(e.target.value); setCurrentPage(1); }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="BENIGN">Benign (Safe)</option>
              <option value="MNPI">MNPI (Insider trading)</option>
              <option value="COLLUSION">Collusion</option>
              <option value="GUARANTEED_RETURN">Guaranteed Return</option>
              <option value="PII_LEAKAGE">PII Leakage</option>
              <option value="AML_SUSPICIOUS">Suspicious Coordination</option>
            </select>
          </div>

          {/* Severity Range Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Severity:</span>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Scores</option>
              <option value="CRITICAL">Critical (80-100)</option>
              <option value="HIGH">High (60-79)</option>
              <option value="MEDIUM">Medium (40-59)</option>
              <option value="MINOR">Minor (20-39)</option>
              <option value="LOW">Low (0-19)</option>
            </select>
          </div>
        </div>

        {/* Results Count & Status Summary */}
        <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            Showing <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}</strong> of <strong>{totalItems}</strong> matching records.
          </div>
          {filteredMessages.length !== messages.length && (
            <button 
              onClick={() => { setSearchQuery(''); setLabelFilter('ALL'); setRiskFilter('ALL'); }}
              style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Main Table Grid */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {loading ? (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '300px', fontSize: '16px', color: '#475569' }}>
              Querying database scored records...
            </div>
          ) : totalItems === 0 ? (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: '12px' }}>
              <AlertTriangle size={32} color="#64748b" />
              <div style={{ fontSize: '16px', color: '#475569', fontWeight: '600' }}>No matching records found.</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Try broadening your search or modifying active filter tags.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700' }}>Raw ID</th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700', cursor: 'pointer' }} onClick={() => toggleSort('timestamp')}>
                      Timestamp <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                    </th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700' }}>Sender</th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700' }}>Team</th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700', cursor: 'pointer' }} onClick={() => toggleSort('risk_score')}>
                      Risk Score <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                    </th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700', cursor: 'pointer' }} onClick={() => toggleSort('primary_label')}>
                      Category <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                    </th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: '700' }}>Snippet</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((msg, index) => {
                    const primaryLabel = getPrimaryLabel(msg);
                    const riskRange = getRiskRange(msg.risk_score);
                    const severity = getSeverityStyle(riskRange);
                    
                    return (
                      <tr 
                        key={msg.raw_id} 
                        style={{ 
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                        }}
                      >
                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#1d4ed8', fontSize: '12px' }}>
                          {msg.raw_id.slice(0, 8)}...
                        </td>
                        <td style={{ padding: '14px 20px', color: '#334155' }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ color: '#0f172a', fontWeight: '600' }}>{msg.sender_id || 'Unknown'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{msg.sender_role || 'Unknown'}</div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#334155' }}>
                          {msg.team || 'Unknown'}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            color: severity.color,
                            backgroundColor: severity.bgColor,
                            border: severity.border,
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {msg.risk_score.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: '600', color: primaryLabel === 'BENIGN' ? '#64748b' : '#ef4444' }}>
                          {primaryLabel}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            color: msg.review_status === 'escalated' ? '#ef4444' : msg.review_status === 'dismissed' ? '#10b981' : '#f59e0b',
                            backgroundColor: msg.review_status === 'escalated' ? '#fef2f2' : msg.review_status === 'dismissed' ? '#ecfdf5' : '#fffbeb',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            border: msg.review_status === 'escalated' ? '1px solid #fecaca' : msg.review_status === 'dismissed' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                          }}>
                            {msg.review_status || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#475569', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={msg.message_text}>
                          {msg.message_text}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer / Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ fontSize: '13px', color: '#475569' }}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: currentPage === 1 ? '#cbd5e1' : '#0f172a',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: currentPage === totalPages ? '#cbd5e1' : '#0f172a',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analysis;
