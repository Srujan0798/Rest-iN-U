'use client';

import { useState } from 'react';

export default function EMFPage() {
    const [bedroomData, setBedroomData] = useState({
        hasPhoneChargerNearBed: false,
        hasWifiRouterNearby: false,
        hasElectricBlanket: false,
        hasPlugInAlarmClock: false,
        hasTVInBedroom: false,
        bedNearOuterWall: false,
        smartMeterNearBedroom: false
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkBedroom = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/emf/bedroom-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bedroomData)
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
        <div className="emf-page">
            <header className="hero">
                <h1>⚡ EMF Health Check</h1>
                <p>Electromagnetic Field Assessment for Better Sleep & Health</p>
            </header>

            <div className="content-grid">
                <div className="form-card">
                    <h2>🛏️ Bedroom EMF Check</h2>
                    <p className="subtitle">Check the items that apply to your bedroom:</p>

                    {Object.entries({
                        hasPhoneChargerNearBed: '📱 Phone charger within 3 feet of bed',
                        hasWifiRouterNearby: '📶 WiFi router in or near bedroom',
                        hasElectricBlanket: '🔌 Electric blanket',
                        hasPlugInAlarmClock: '⏰ Plug-in alarm clock on nightstand',
                        hasTVInBedroom: '📺 TV in bedroom',
                        bedNearOuterWall: '🧱 Bed against outer wall',
                        smartMeterNearBedroom: '📊 Smart meter near bedroom wall'
                    }).map(([key, label]) => (
                        <label key={key} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={(bedroomData as any)[key]}
                                onChange={(e) => setBedroomData({ ...bedroomData, [key]: e.target.checked })}
                            />
                            <span>{label}</span>
                        </label>
                    ))}

                    <button onClick={checkBedroom} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Analyze Bedroom EMF'}
                    </button>
                </div>

                {result && (
                    <div className="results">
                        <div className="score-card">
                            <div className="score-circle" style={{
                                background: `conic-gradient(
                  ${result.bedroomEMFScore >= 80 ? '#22c55e' : result.bedroomEMFScore >= 60 ? '#f59e0b' : '#ef4444'} 
                  ${result.bedroomEMFScore}%, #e2e8f0 ${result.bedroomEMFScore}%
                )`
                            }}>
                                <span className="score-value">{result.bedroomEMFScore}</span>
                            </div>
                            <div className="score-info">
                                <h3>Bedroom EMF Score</h3>
                                <span className={`grade ${result.bedroomEMFScore >= 80 ? 'good' : result.bedroomEMFScore >= 60 ? 'moderate' : 'poor'}`}>
                                    {result.grade}
                                </span>
                            </div>
                        </div>

                        <div className="impact-card">
                            <h3>Sleep Quality Impact</h3>
                            <span className={`impact ${result.sleepQualityImpact.includes('Likely') ? 'negative' : 'positive'}`}>
                                {result.sleepQualityImpact}
                            </span>
                        </div>

                        {result.issues?.length > 0 && (
                            <div className="issues-card">
                                <h3>⚠️ Issues Found ({result.issuesFound})</h3>
                                <div className="issues-solutions">
                                    {result.issues.map((issue: string, i: number) => (
                                        <div key={i} className="issue-item">
                                            <div className="issue">
                                                <span className="icon">❌</span>
                                                <span>{issue}</span>
                                            </div>
                                            <div className="solution">
                                                <span className="icon">✅</span>
                                                <span>{result.solutions[i]}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.issuesFound === 0 && (
                            <div className="perfect-card">
                                <span className="emoji">🎉</span>
                                <h3>Excellent!</h3>
                                <p>Your bedroom has minimal EMF exposure. Great for sleep quality!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="info-section">
                <h2>About EMF Exposure</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <span className="emoji">💤</span>
                        <h4>Sleep Impact</h4>
                        <p>EMF exposure can interfere with melatonin production and disrupt sleep cycles.</p>
                    </div>
                    <div className="info-card">
                        <span className="emoji">🧠</span>
                        <h4>Health Effects</h4>
                        <p>Long-term exposure may affect cognitive function and cellular repair during sleep.</p>
                    </div>
                    <div className="info-card">
                        <span className="emoji">📏</span>
                        <h4>Safe Distance</h4>
                        <p>Keeping electronics 6+ feet from your bed significantly reduces exposure.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .emf-page {
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
          background: linear-gradient(135deg, #eab308, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        @media (max-width: 768px) {
          .content-grid { grid-template-columns: 1fr; }
        }
        
        .form-card, .score-card, .impact-card, .issues-card, .perfect-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .form-card h2 {
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #64748b;
          margin-bottom: 1.5rem;
        }
        
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .checkbox-item:hover {
          background: #f1f5f9;
        }
        
        .checkbox-item input {
          width: 20px;
          height: 20px;
        }
        
        .form-card button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #eab308, #f59e0b);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }
        
        .results {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .score-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .score-circle::before {
          content: '';
          position: absolute;
          width: 70px;
          height: 70px;
          background: white;
          border-radius: 50%;
        }
        
        .score-value {
          position: relative;
          font-size: 1.75rem;
          font-weight: 700;
        }
        
        .score-info h3 {
          margin: 0;
        }
        
        .grade {
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .grade.good { color: #22c55e; }
        .grade.moderate { color: #f59e0b; }
        .grade.poor { color: #ef4444; }
        
        .impact-card h3 {
          margin-bottom: 0.5rem;
        }
        
        .impact {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .impact.positive { color: #22c55e; }
        .impact.negative { color: #ef4444; }
        
        .issues-card h3 {
          margin-bottom: 1rem;
        }
        
        .issue-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .issue, .solution {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .issue { color: #dc2626; }
        .solution { color: #16a34a; }
        
        .icon { font-size: 0.875rem; }
        
        .perfect-card {
          text-align: center;
          background: #ecfdf5;
        }
        
        .perfect-card .emoji {
          font-size: 3rem;
        }
        
        .perfect-card h3 {
          margin: 0.5rem 0;
          color: #16a34a;
        }
        
        .info-section {
          margin-top: 2rem;
        }
        
        .info-section h2 {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .info-grid { grid-template-columns: 1fr; }
        }
        
        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .info-card .emoji {
          font-size: 2rem;
        }
        
        .info-card h4 {
          margin: 0.75rem 0 0.5rem;
        }
        
        .info-card p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }
      `}</style>
        </div>
    );
}
