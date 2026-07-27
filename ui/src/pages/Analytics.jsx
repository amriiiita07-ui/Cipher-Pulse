import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../api/client';
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  ShieldAlert, 
  Activity,
  Calendar
} from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats for analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Mock static category counts since model classes are dynamic, but we want highly detailed plots
  const categoryData = [
    { name: 'Insider Trading', count: 36, percentage: 20, color: '#f43f5e' },
    { name: 'Collusion', count: 32, percentage: 18, color: '#f59e0b' },
    { name: 'Guaranteed Returns', count: 40, percentage: 22, color: '#8b5cf6' },
    { name: 'PII Leakage', count: 41, percentage: 23, color: '#06b6d4' },
    { name: 'Coordination (AML)', count: 31, percentage: 17, color: '#10b981' }
  ];

  const deskData = [
    { desk: 'Equities Desk', risk: 85, color: '#f43f5e' },
    { desk: 'Fixed Income', risk: 42, color: '#f59e0b' },
    { desk: 'FX Trading Desk', risk: 64, color: '#8b5cf6' },
    { desk: 'Wealth Management', risk: 18, color: '#10b981' },
    { desk: 'Commodities Desk', risk: 55, color: '#06b6d4' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', color: '#1e293b' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.5px', color: '#0f172a' }}>Compliance Intelligence</h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>Visual analytics, risk concentration levels, and historical surveillance metrics</p>
          </div>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#475569', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Calendar size={14} /> Last 30 Days (Active Stream)
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#64748b' }}>
            Aggregating platform metrics...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* KPI Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#475569', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={14} color="#0284c7" /> TOTAL SURVEYED</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{stats?.total_messages || '1,500'}</div>
                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px' }}>&uarr; 12% increase from yesterday</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', borderLeft: '4px solid #8b5cf6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={14} /> IDENTIFIED ALERTS</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{stats?.total_alerts || '180'}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Risk Density: {stats ? ((stats.total_alerts / stats.total_messages) * 100).toFixed(1) : '12.0'}%</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#b45309', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={14} /> AUDITED ALERTS</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{stats?.reviewed || '42'}</div>
                <div style={{ fontSize: '11px', color: '#b45309', marginTop: '6px' }}>{stats ? Math.round((stats.reviewed / stats.total_alerts) * 100) : '23'}% review progress</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', borderLeft: '4px solid #10b981', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#047857', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={14} /> FALSE POSITIVE RATE</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{(stats?.false_positive_rate * 100 || 8.2).toFixed(1)}%</div>
                <div style={{ fontSize: '11px', color: '#047857', marginTop: '6px' }}>Well within compliance targets</div>
              </div>
            </div>

            {/* Grid Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              {/* Chart 1: SVG Bar Chart - Alerts by Category */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <BarChart size={18} color="#0284c7" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Risks Flagged by Regulatory Category</h3>
                </div>
                
                {/* SVG Bar Chart */}
                <div style={{ position: 'relative', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px', borderBottom: '1px solid #e2e8f0' }}>
                  {categoryData.map((item, idx) => {
                    const barHeight = `${item.percentage * 7}%`;
                    return (
                      <div key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', height: '100%', justifyContent: 'flex-end' }}>
                        {/* Bar */}
                        <div style={{
                          width: '100%',
                          height: barHeight,
                          background: `linear-gradient(to top, ${item.color}cc, ${item.color})`,
                          borderRadius: '4px 4px 0 0',
                          position: 'relative',
                          boxShadow: `0 2px 6px ${item.color}20`,
                          transition: 'transform 0.2s',
                          cursor: 'pointer'
                        }}
                        title={`${item.name}: ${item.count} alerts`}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                        >
                          <span style={{ position: 'absolute', top: '-24px', left: 0, width: '100%', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 4px' }}>
                  {categoryData.map((item) => (
                    <div key={item.name} style={{ width: '15%', textAlign: 'center', fontSize: '10px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                       {item.name.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: SVG Donut Donut Chart - Review Action Split */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <PieChart size={18} color="#8b5cf6" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Alert Audit Resolution Status</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '220px' }}>
                  {/* SVG Circular Donut Chart */}
                  <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      {/* Grey Background Ring */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                      
                      {/* Segment 1: Escalated (TP) - 30% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="0" />
                      
                      {/* Segment 2: Dismissed (FP) - 50% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.8" strokeDasharray="50 50" strokeDashoffset="-30" />
                      
                      {/* Segment 3: Pending - 20% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="20 80" strokeDashoffset="-80" />
                    </svg>
                    
                    {/* Inner Text Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                        {stats?.total_alerts || '180'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
                        Alerts
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }} />
                      <span style={{ color: '#475569' }}>Dismissed (FP):</span>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>50%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f43f5e' }} />
                      <span style={{ color: '#475569' }}>Escalated (TP):</span>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>30%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b' }} />
                      <span style={{ color: '#475569' }}>Pending Audit:</span>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>20%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Horizontal Desk/Team Risk Section */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <TrendingUp size={18} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Active Risk Concentrations by Trading Unit</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {deskData.map((item) => (
                  <div key={item.desk} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 50px', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{item.desk}</div>
                    
                    {/* Background track */}
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      {/* Bar fill */}
                      <div style={{ 
                        height: '100%', 
                        width: `${item.risk}%`, 
                        backgroundColor: item.color,
                        borderRadius: '4px',
                        boxShadow: `0 1px 3px ${item.color}30`
                      }} />
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: '700', color: item.color, textAlign: 'right' }}>
                      {item.risk}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
