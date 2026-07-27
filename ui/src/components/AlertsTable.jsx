import React from 'react';
import { AlertCircle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

const AlertsTable = ({ alerts, onReview }) => {
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle color="var(--accent-red)" size={20} /> Active Compliance Alerts
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Showing {alerts.length} high-risk flags</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Risk Score</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Message</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Sender</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Flags</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No active alerts found. Good job!
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.raw_id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ 
                      fontWeight: '700', 
                      color: alert.risk_score >= 80 ? 'var(--accent-red)' : 'var(--accent-amber)',
                      fontSize: '18px'
                    }}>
                      {Math.round(alert.risk_score)}
                    </div>
                  </td>
                  <td style={{ padding: '16px', maxWidth: '300px' }}>
                    <div style={{ 
                      fontSize: '14px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      color: 'var(--text-primary)'
                    }}>
                      {alert.message_text}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Clock size={10} /> {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{alert.sender_id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{alert.team}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {alert.labels.map(l => (
                        <span key={l} style={{ 
                          fontSize: '10px', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          backgroundColor: '#f3f4f6', 
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)'
                        }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`status-badge ${alert.review_status === 'dismissed' ? 'status-low' : alert.review_status === 'confirmed' ? 'status-high' : 'status-medium'}`}>
                      {alert.review_status || 'New'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => onReview(alert)}
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      Review <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsTable;
