'use client';

import { useState } from 'react';

export default function SacredGeometryPage() {
    const [dimensions, setDimensions] = useState({ length: 40, width: 25, height: 10 });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const analyzeGeometry = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/sacred-geometry/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dimensions)
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
        <div className="geometry-page">
            <header className="hero">
                <h1>📐 Sacred Geometry Analysis</h1>
                <p>Discover the divine proportions in your property</p>
            </header>

            <div className="content-grid">
                <div className="form-card">
                    <h2>Property Dimensions</h2>

                    <div className="form-group">
                        <label>Length (ft)</label>
                        <input
                            type="number"
                            value={dimensions.length}
                            onChange={(e) => setDimensions({ ...dimensions, length: +e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Width (ft)</label>
                        <input
                            type="number"
                            value={dimensions.width}
                            onChange={(e) => setDimensions({ ...dimensions, width: +e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Height (ft)</label>
                        <input
                            type="number"
                            value={dimensions.height}
                            onChange={(e) => setDimensions({ ...dimensions, height: +e.target.value })}
                        />
                    </div>

                    <div className="ratio-preview">
                        <span>Your Ratio: </span>
                        <strong>{(dimensions.length / dimensions.width).toFixed(3)}</strong>
                    </div>

                    <button onClick={analyzeGeometry} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Analyze Sacred Geometry'}
                    </button>
                </div>

                {result && (
                    <div className="results">
                        <div className="score-card">
                            <div className="score-display">
                                <div className="score-ring" style={{
                                    background: `conic-gradient(#8b5cf6 ${result.sacredGeometryScore}%, #e2e8f0 ${result.sacredGeometryScore}%)`
                                }}>
                                    <span>{result.sacredGeometryScore}</span>
                                </div>
                                <div className="score-label">
                                    <h3>Alignment Score</h3>
                                    <span className="grade">{result.grade}</span>
                                </div>
                            </div>
                        </div>

                        <div className="ratio-card">
                            <h3>Closest Sacred Ratio</h3>
                            <div className="sacred-ratio">
                                <span className="ratio-value">{result.closestSacredRatio?.value}</span>
                                <span className="ratio-name">{result.closestSacredRatio?.name}</span>
                            </div>
                            <p className="description">{result.closestSacredRatio?.description}</p>
                            <div className="examples">
                                <strong>Found in:</strong>
                                {result.closestSacredRatio?.examples?.map((ex: string, i: number) => (
                                    <span key={i} className="example-tag">{ex}</span>
                                ))}
                            </div>
                        </div>

                        <div className="ratios-card">
                            <h3>Ratio Analysis</h3>
                            <div className="ratios-list">
                                {Object.entries(result.ratioAnalysis || {}).map(([key, data]: [string, any]) => (
                                    <div key={key} className="ratio-item">
                                        <div className="ratio-header">
                                            <span className="name">{data.name}</span>
                                            <span className={`alignment ${data.alignment.toLowerCase()}`}>{data.alignment}</span>
                                        </div>
                                        <div className="ratio-bar">
                                            <div
                                                className="fill"
                                                style={{ width: `${Math.max(0, 100 - parseFloat(data.deviationPercent))}%` }}
                                            />
                                        </div>
                                        <div className="ratio-stats">
                                            <span>Sacred: {data.sacredValue}</span>
                                            <span>Yours: {data.propertyRatio}</span>
                                            <span>Deviation: {data.deviationPercent}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="recommendations-card">
                            <h3>Recommendations</h3>
                            <ul>
                                {result.recommendations?.map((rec: string, i: number) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="shapes-card">
                            <h3>Sacred Shapes to Enhance Energy</h3>
                            <div className="shapes-grid">
                                {result.suggestedPlacements?.slice(0, 4).map((shape: any) => (
                                    <div key={shape.id} className="shape-item">
                                        <h4>{shape.name}</h4>
                                        <p>{shape.description}</p>
                                        <span className="energy">{shape.energy}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .geometry-page {
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
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
        }
        
        .form-card, .score-card, .ratio-card, .ratios-card, .recommendations-card, .shapes-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .form-card {
          height: fit-content;
          position: sticky;
          top: 2rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
        }
        
        .ratio-preview {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .ratio-preview strong {
          font-size: 1.5rem;
          color: #8b5cf6;
          display: block;
        }
        
        .form-card button {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .results {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .score-display {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .score-ring {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .score-ring::before {
          content: '';
          position: absolute;
          width: 70px;
          height: 70px;
          background: white;
          border-radius: 50%;
        }
        
        .score-ring span {
          position: relative;
          font-size: 1.75rem;
          font-weight: 700;
        }
        
        .score-label h3 {
          margin: 0;
        }
        
        .grade {
          color: #8b5cf6;
          font-weight: 600;
        }
        
        .sacred-ratio {
          margin: 1rem 0;
        }
        
        .ratio-value {
          font-size: 3rem;
          font-weight: 700;
          color: #8b5cf6;
        }
        
        .ratio-name {
          display: block;
          color: #64748b;
        }
        
        .examples {
          margin-top: 1rem;
        }
        
        .example-tag {
          display: inline-block;
          background: #f3e8ff;
          color: #7c3aed;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin: 0.25rem;
          font-size: 0.8rem;
        }
        
        .ratio-item {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }
        
        .ratio-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .alignment {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
        }
        
        .alignment.excellent { background: #dcfce7; color: #16a34a; }
        .alignment.good { background: #fef3c7; color: #d97706; }
        .alignment.fair { background: #fee2e2; color: #dc2626; }
        .alignment.poor { background: #f1f5f9; color: #64748b; }
        
        .ratio-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .ratio-bar .fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a855f7);
        }
        
        .ratio-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .shapes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .shape-item {
          padding: 1rem;
          background: #faf5ff;
          border-radius: 8px;
        }
        
        .shape-item h4 {
          margin: 0 0 0.5rem;
          color: #7c3aed;
        }
        
        .shape-item p {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        
        .energy {
          font-size: 0.75rem;
          color: #8b5cf6;
          font-style: italic;
        }
        
        .recommendations-card ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        
        .recommendations-card li {
          margin-bottom: 0.5rem;
        }
      `}</style>
        </div>
    );
}
