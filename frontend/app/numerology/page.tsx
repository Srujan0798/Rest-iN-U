'use client';

import { useState } from 'react';

export default function NumerologyPage() {
    const [address, setAddress] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'address' | 'compatibility'>('address');

    const calculateAddressNumber = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/numerology/address-number', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="numerology-page">
            <header className="hero">
                <h1>🔮 Numerology Calculator</h1>
                <p>Discover the vibrational energy of any property address</p>
            </header>

            <div className="tabs">
                <button
                    className={activeTab === 'address' ? 'active' : ''}
                    onClick={() => setActiveTab('address')}
                >
                    Address Numerology
                </button>
                <button
                    className={activeTab === 'compatibility' ? 'active' : ''}
                    onClick={() => setActiveTab('compatibility')}
                >
                    Compatibility Check
                </button>
            </div>

            <div className="calculator-card">
                {activeTab === 'address' ? (
                    <>
                        <h2>Calculate Address Number</h2>
                        <div className="form-group">
                            <label>Property Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="e.g., 123 Main Street"
                            />
                        </div>
                        <button onClick={calculateAddressNumber} disabled={loading || !address}>
                            {loading ? 'Calculating...' : 'Calculate'}
                        </button>
                    </>
                ) : (
                    <>
                        <h2>Check Compatibility</h2>
                        <div className="form-group">
                            <label>Your Birth Date</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Property Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="e.g., 456 Oak Avenue"
                            />
                        </div>
                        <button onClick={calculateAddressNumber} disabled={loading || !address || !birthDate}>
                            {loading ? 'Analyzing...' : 'Check Compatibility'}
                        </button>
                    </>
                )}

                {result && (
                    <div className="result">
                        <div className="number-display">
                            <span className="number">{result.addressNumber}</span>
                            {result.isMasterNumber && <span className="master-badge">Master Number</span>}
                        </div>
                        <h3>{result.meaning}</h3>
                        <p className="vibe">{result.vibe}</p>

                        <div className="details-grid">
                            <div className="detail-card">
                                <h4>🌍 Element</h4>
                                <p>{result.element}</p>
                            </div>
                            <div className="detail-card">
                                <h4>🪐 Planet</h4>
                                <p>{result.planet}</p>
                            </div>
                        </div>

                        <div className="lists">
                            <div className="list">
                                <h4>Best For</h4>
                                <ul>
                                    {result.bestFor?.map((item: string, i: number) => (
                                        <li key={i}>✓ {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="list">
                                <h4>May Not Suit</h4>
                                <ul>
                                    {result.avoid?.map((item: string, i: number) => (
                                        <li key={i}>✗ {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .numerology-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .hero {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .tabs button {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .tabs button.active {
          background: #6366f1;
          border-color: #6366f1;
          color: white;
        }
        
        .calculator-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .calculator-card > button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        
        .calculator-card > button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .result {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .number-display {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .number {
          display: inline-block;
          font-size: 4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .master-badge {
          display: block;
          font-size: 0.875rem;
          color: #6366f1;
          font-weight: 600;
        }
        
        .result h3 {
          text-align: center;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .vibe {
          text-align: center;
          color: #64748b;
          margin-bottom: 1.5rem;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .detail-card {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        
        .detail-card h4 {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        
        .detail-card p {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .lists {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .list h4 {
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .list li {
          padding: 0.25rem 0;
          font-size: 0.9rem;
          color: #64748b;
        }
      `}</style>
        </div>
    );
}
