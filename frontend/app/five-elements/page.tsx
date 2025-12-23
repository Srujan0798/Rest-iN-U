'use client';

import { useState } from 'react';

const DIRECTIONS = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest', 'Center'];

export default function FiveElementsPage() {
    const [formData, setFormData] = useState({
        entranceDirection: 'East',
        kitchenDirection: 'Southeast',
        bedroomDirection: 'Southwest',
        bathroomDirection: 'North',
        dominantColors: ['White', 'Beige'],
        hasWaterFeature: false,
        hasFireplace: false,
        hasOpenCourtyard: false
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const analyzeElements = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/five-elements/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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
        <div className="elements-page">
            <header className="hero">
                <h1>☯️ Five Elements Analysis</h1>
                <p>Pancha Bhuta - Balance Earth, Water, Fire, Air & Space in your property</p>
            </header>

            <div className="main-grid">
                <div className="form-card">
                    <h2>Property Configuration</h2>

                    {['entrance', 'kitchen', 'bedroom', 'bathroom'].map((room) => (
                        <div key={room} className="form-group">
                            <label>{room.charAt(0).toUpperCase() + room.slice(1)} Direction</label>
                            <select
                                value={(formData as any)[`${room}Direction`]}
                                onChange={(e) => setFormData({ ...formData, [`${room}Direction`]: e.target.value })}
                            >
                                {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    ))}

                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasWaterFeature}
                                onChange={(e) => setFormData({ ...formData, hasWaterFeature: e.target.checked })}
                            />
                            Has Water Feature (fountain, pool)
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasFireplace}
                                onChange={(e) => setFormData({ ...formData, hasFireplace: e.target.checked })}
                            />
                            Has Fireplace
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasOpenCourtyard}
                                onChange={(e) => setFormData({ ...formData, hasOpenCourtyard: e.target.checked })}
                            />
                            Has Open Courtyard
                        </label>
                    </div>

                    <button onClick={analyzeElements} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Analyze Five Elements'}
                    </button>
                </div>

                {result && (
                    <div className="results-card">
                        <div className="score-section">
                            <div className="score-circle" style={{
                                background: `conic-gradient(
                  #10b981 ${result.fiveElementScore}%,
                  #e2e8f0 ${result.fiveElementScore}%
                )`
                            }}>
                                <span className="score-value">{result.fiveElementScore}</span>
                            </div>
                            <div className="score-details">
                                <h3>Balance Score</h3>
                                <span className="grade">Grade: {result.grade}</span>
                            </div>
                        </div>

                        <div className="elements-bar">
                            {Object.entries(result.elementBalance || {}).map(([element, percent]: [string, any]) => (
                                <div
                                    key={element}
                                    className="element-segment"
                                    style={{ flex: percent, background: getElementColor(element) }}
                                    title={`${element}: ${percent}%`}
                                >
                                    <span>{element.charAt(0).toUpperCase()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="info-grid">
                            <div className="info-card dominant">
                                <span className="emoji">{getElementEmoji(result.dominantElement)}</span>
                                <h4>Dominant Element</h4>
                                <p>{result.dominantElement?.charAt(0).toUpperCase() + result.dominantElement?.slice(1)}</p>
                            </div>

                            <div className="info-card deficient">
                                <span className="emoji">{getElementEmoji(result.deficientElement)}</span>
                                <h4>Needs Enhancement</h4>
                                <p>{result.deficientElement?.charAt(0).toUpperCase() + result.deficientElement?.slice(1)}</p>
                            </div>
                        </div>

                        <div className="recommendations">
                            <h3>Recommendations</h3>
                            <ul>
                                {result.recommendations?.map((rec: string, i: number) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>

                        {result.roomPlacements && (
                            <div className="placements">
                                <h3>Room Placements</h3>
                                {result.roomPlacements.map((room: any, i: number) => (
                                    <div key={i} className={`room-item ${room.isOptimal ? 'optimal' : 'suboptimal'}`}>
                                        <span className="room-name">{room.room}</span>
                                        <span className="room-status">
                                            {room.isOptimal ? '✓ Optimal' : `Move to ${room.idealDirections[0]}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
        .elements-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .hero {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #059669, #0891b2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .form-card, .results-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .form-card h2 {
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
        }
        
        .checkbox-group {
          margin: 1.5rem 0;
        }
        
        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .form-card button {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #059669, #0891b2);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .score-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
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
          color: #1e293b;
        }
        
        .score-details h3 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .grade {
          color: #10b981;
          font-weight: 600;
        }
        
        .elements-bar {
          display: flex;
          height: 32px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        
        .element-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.75rem;
          min-width: 24px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .info-card {
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
        }
        
        .info-card.dominant {
          background: #dcfce7;
        }
        
        .info-card.deficient {
          background: #fef3c7;
        }
        
        .info-card .emoji {
          font-size: 2rem;
        }
        
        .info-card h4 {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0.5rem 0 0.25rem;
        }
        
        .info-card p {
          font-weight: 600;
          margin: 0;
        }
        
        .recommendations h3, .placements h3 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .recommendations ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        
        .recommendations li {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .placements {
          margin-top: 1.5rem;
        }
        
        .room-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.875rem;
        }
        
        .room-item.optimal .room-status {
          color: #10b981;
        }
        
        .room-item.suboptimal .room-status {
          color: #f59e0b;
        }
      `}</style>
        </div>
    );
}

function getElementColor(element: string): string {
    const colors: Record<string, string> = {
        earth: '#a3a36e',
        water: '#38bdf8',
        fire: '#f97316',
        air: '#94a3b8',
        space: '#a78bfa'
    };
    return colors[element] || '#64748b';
}

function getElementEmoji(element: string): string {
    const emojis: Record<string, string> = {
        earth: '🏔️',
        water: '💧',
        fire: '🔥',
        air: '🌬️',
        space: '✨'
    };
    return emojis[element] || '⚪';
}

