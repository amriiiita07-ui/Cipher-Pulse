import React, { useState } from 'react';
import { Send, User, Briefcase, Tag } from 'lucide-react';
import { api } from '../api/client';

const MessageComposer = ({ onMessageSent }) => {
  const [text, setText] = useState('');
  const [sender, setSender] = useState('john.mitchell');
  const [role, setRole] = useState('Trader');
  const [team, setTeam] = useState('Equities Trading');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await api.analyzeMessage({
        message_text: text,
        sender_id: sender,
        sender_role: role,
        team: team,
        source: 'ui-simulation'
      });
      
      setText('');
      if (onMessageSent) onMessageSent(response.data);
    } catch (err) {
      console.error("Failed to analyze message:", err);
      alert("Error sending message to analysis engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Simulate Communication</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <User size={14} /> Sender ID
            </label>
            <input 
              type="text" 
              value={sender} 
              onChange={(e) => setSender(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Tag size={14} /> Role
            </label>
            <input 
              type="text" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Briefcase size={14} /> Team
            </label>
            <input 
              type="text" 
              value={team} 
              onChange={(e) => setTeam(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Message Content</label>
          <textarea 
            rows="4" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message to test compliance detection (e.g., 'I guarantee 20% returns')..."
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#ffffff', 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              color: 'var(--text-primary)',
              resize: 'vertical',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || !text.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? 'Analyzing...' : <><Send size={18} /> Analyze Message</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;
