import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Info, User } from 'lucide-react';
import { api } from '../api/client';

const ReviewModal = ({ alert, onClose, onUpdate }) => {
  const [status, setStatus] = useState(alert.review_status || 'open');
  const [feedback, setFeedback] = useState(alert.feedback || '');
  const [notes, setNotes] = useState(alert.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitFeedback({
        raw_id: alert.raw_id,
        review_status: status,
        feedback: feedback,
        notes: notes,
        reviewer: 'compliance-officer-01'
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Error saving review.");
    } finally {
      setLoading(false);
    }
  };

  const explanation = alert.explanation || {};
  const highlightedSpans = explanation.highlighted_spans || [];

  // Helper to highlight tokens in text
  const renderHighlightedText = () => {
    const text = alert.message_text;
    if (!highlightedSpans.length) return text;

    let result = [];
    let lastIndex = 0;
    
    // Sort spans by start index
    const sortedSpans = [...highlightedSpans].sort((a, b) => a.start - b.start);

    sortedSpans.forEach((span, i) => {
      // Add plain text before
      result.push(text.substring(lastIndex, span.start));
      // Add highlighted span
      result.push(
        <mark key={i} style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.3)', 
          color: 'var(--accent-red)', 
          padding: '2px 0',
          borderRadius: '2px',
          fontWeight: '600',
          borderBottom: '2px solid var(--accent-red)'
        }}>
          {text.substring(span.start, span.end)}
        </mark>
      );
      lastIndex = span.end;
    });
    
    result.push(text.substring(lastIndex));
    return result;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Review Alert</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>MESSAGE CONTENT</h4>
              <div style={{ 
                padding: '16px', background: '#ffffff', borderRadius: '4px', border: '1px solid var(--border)',
                lineHeight: '1.6', fontSize: '16px'
              }}>
                {renderHighlightedText()}
              </div>
              
              <h4 style={{ margin: '24px 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>AI EXPLANATION</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                {explanation.reason_summary}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(explanation.top_tokens || []).map((t, i) => (
                  <div key={i} style={{ 
                    fontSize: '12px', padding: '4px 10px', borderRadius: '4px', 
                    background: '#f3f4f6', border: '1px solid var(--border)',
                    display: 'flex', gap: '8px'
                  }}>
                    <span style={{ color: 'var(--text-primary)' }}>{t.token}</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{t.score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ padding: '20px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>METADATA</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>SENDER</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14}/> {alert.sender_id}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>TEAM</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{alert.team}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>RISK SCORE</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-red)' }}>{Math.round(alert.risk_score)}/100</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>SOURCE</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{alert.source}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>DECISION</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <label style={{ 
                    cursor: 'pointer', padding: '12px', borderRadius: '4px', border: `1px solid ${feedback === 'true_positive' ? 'var(--accent-red)' : 'var(--border)'}`,
                    backgroundColor: feedback === 'true_positive' ? '#fef2f2' : '#ffffff',
                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)'
                  }}>
                    <input type="radio" name="feedback" value="true_positive" checked={feedback === 'true_positive'} onChange={e => {setFeedback(e.target.value); setStatus('confirmed');}} style={{ display: 'none' }} />
                    <CheckCircle size={16} color={feedback === 'true_positive' ? 'var(--accent-red)' : 'var(--text-secondary)'} /> True Positive
                  </label>
                  <label style={{ 
                    cursor: 'pointer', padding: '12px', borderRadius: '4px', border: `1px solid ${feedback === 'false_positive' ? 'var(--accent-green)' : 'var(--border)'}`,
                    backgroundColor: feedback === 'false_positive' ? '#f0fdf4' : '#ffffff',
                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)'
                  }}>
                    <input type="radio" name="feedback" value="false_positive" checked={feedback === 'false_positive'} onChange={e => {setFeedback(e.target.value); setStatus('dismissed');}} style={{ display: 'none' }} />
                    <XCircle size={16} color={feedback === 'false_positive' ? 'var(--accent-green)' : 'var(--text-secondary)'} /> False Positive
                  </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>NOTES / JUSTIFICATION</label>
                  <textarea 
                    rows="3" 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Enter review notes here..."
                    style={{ 
                      width: '100%', padding: '12px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)',
                      fontSize: '14px', resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn-primary" disabled={loading || !feedback} style={{ flex: 1 }}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
