'use client';

import { useState } from 'react';

export default function MuhuratPage() {
    const [purpose, setPurpose] = useState('purchase');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const findAuspiciousDates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/muhurat/find-dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purpose, startDate, endDate })
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="muhurat-page">
            <header className="hero">
                <h1>🕉️ Muhurat Calculator</h1>
                <p>Find auspicious dates for your property journey based on Vedic astrology</p>
            </header>

            <div className="calculator-card">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Purpose</label>
                        <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                            <option value="purchase">Property Purchase</option>
                            <option value="sale">Property Sale</option>
                            <option value="moving">Moving / Relocation</option>
                            <option value="griha_pravesh">Griha Pravesh (Housewarming)</option>
                            <option value="construction">Start Construction</option>
                            <option value="renovation">Renovation</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={findAuspiciousDates}
                    disabled={loading || !startDate || !endDate}
                >
                    {loading ? 'Finding Auspicious Dates...' : 'Find Auspicious Dates'}
                </button>
            </div>

            {results && (
                <div className="results">
                    <h2>📅 Auspicious Dates Found: {results.totalFound}</h2>

                    {results.specialNotes?.length > 0 && (
                        <div className="notes-card">
                            <h3>📜 Special Notes for {purpose}</h3>
                            <ul>
                                {results.specialNotes.map((note: string, i: number) => (
                                    <li key={i}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="dates-grid">
                        {results.auspiciousDates?.map((date: any, i: number) => (
                            <div key={i} className={`date-card ${i === 0 ? 'best' : ''}`}>
                                {i === 0 && <span className="best-badge">Best Date</span>}
                                <div className="date-header">
                                    <span className="date">{new Date(date.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                    <span className="score">{date.overallScore}%</span>
                                </div>

                                <div className="date-details">
                                    <div className="detail">
                                        <span className="label">Nakshatra</span>
                                        <span className="value">{date.nakshatra}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Tithi</span>
                                        <span className="value">{date.tithi}</span>
                                    </div>
                                </div>

                                <div className="factors">
                                    {date.factors?.map((factor: string, j: number) => (
                                        <span key={j} className={`factor ${factor.includes('⚠') ? 'warning' : ''}`}>
                                            {factor}
                                        </span>
                                    ))}
                                </div>

                                {date.auspiciousHours?.length > 0 && (
                                    <div className="hours">
                                        <strong>Auspicious Hours:</strong>
                                        {date.auspiciousHours.map((h: any, k: number) => (
                                            <span key={k} className="hour">{h.start} - {h.end}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
        .muhurat-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .hero {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #f97316, #dc2626);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .calculator-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        
        .form-group select,
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .calculator-card > button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #f97316, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        
        .calculator-card > button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .results h2 {
          margin-bottom: 1.5rem;
        }
        
        .notes-card {
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .notes-card h3 {
          margin-bottom: 0.75rem;
          color: #92400e;
        }
        
        .notes-card ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .notes-card li {
          color: #78350f;
          margin-bottom: 0.5rem;
        }
        
        .dates-grid {
          display: grid;
          gap: 1rem;
        }
        
        .date-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
          position: relative;
        }
        
        .date-card.best {
          border-color: #10b981;
          background: #ecfdf5;
        }
        
        .best-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .date-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .date-header .date {
          font-weight: 600;
          color: #1e293b;
        }
        
        .date-header .score {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
        }
        
        .date-details {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
        }
        
        .detail .label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .detail .value {
          font-weight: 500;
          color: #1e293b;
        }
        
        .factors {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .factor {
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          background: #f1f5f9;
          border-radius: 4px;
          color: #475569;
        }
        
        .factor.warning {
          background: #fef3c7;
          color: #92400e;
        }
        
        .hours {
          margin-top: 1rem;
          font-size: 0.875rem;
        }
        
        .hour {
          display: inline-block;
          margin-left: 0.5rem;
          color: #6366f1;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
}
