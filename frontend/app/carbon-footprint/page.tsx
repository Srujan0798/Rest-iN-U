'use client';

import { useState } from 'react';

export default function CarbonFootprintPage() {
    const [formData, setFormData] = useState({
        monthlyElectricityKwh: 900,
        monthlyGasTherms: 40,
        constructionType: 'mixed' as const,
        yearBuilt: 1990,
        commuteMilesOneWay: 15,
        workFromHomeDays: 2
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const calculateFootprint = async () => {
        setLoading(true);
        try {
            // Using a mock property ID for demo - in production, use actual property
            const res = await fetch('/api/v1/carbon-footprint/property/demo-property-id', {
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
        <div className="carbon-page">
            <header className="hero">
                <h1>🌍 Carbon Footprint Calculator</h1>
                <p>Understand and reduce your property's environmental impact</p>
            </header>

            <div className="main-content">
                <div className="form-card">
                    <h2>Property Details</h2>

                    <div className="form-group">
                        <label>Monthly Electricity (kWh)</label>
                        <input
                            type="number"
                            value={formData.monthlyElectricityKwh}
                            onChange={(e) => setFormData({ ...formData, monthlyElectricityKwh: +e.target.value })}
                        />
                        <span className="hint">Average US home: 900 kWh/month</span>
                    </div>

                    <div className="form-group">
                        <label>Monthly Natural Gas (therms)</label>
                        <input
                            type="number"
                            value={formData.monthlyGasTherms}
                            onChange={(e) => setFormData({ ...formData, monthlyGasTherms: +e.target.value })}
                        />
                        <span className="hint">Average US home: 40 therms/month</span>
                    </div>

                    <div className="form-group">
                        <label>Construction Type</label>
                        <select
                            value={formData.constructionType}
                            onChange={(e) => setFormData({ ...formData, constructionType: e.target.value as any })}
                        >
                            <option value="wood">Wood Frame</option>
                            <option value="concrete">Concrete</option>
                            <option value="steel">Steel Frame</option>
                            <option value="brick">Brick</option>
                            <option value="mixed">Mixed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>One-Way Commute (miles)</label>
                        <input
                            type="number"
                            value={formData.commuteMilesOneWay}
                            onChange={(e) => setFormData({ ...formData, commuteMilesOneWay: +e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Work From Home Days/Week</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={formData.workFromHomeDays}
                            onChange={(e) => setFormData({ ...formData, workFromHomeDays: +e.target.value })}
                        />
                        <span className="range-value">{formData.workFromHomeDays} days</span>
                    </div>

                    <button onClick={calculateFootprint} disabled={loading}>
                        {loading ? 'Calculating...' : 'Calculate Footprint'}
                    </button>
                </div>

                {result && (
                    <div className="results">
                        <div className="total-card">
                            <h2>Annual Carbon Footprint</h2>
                            <div className="total-value">
                                <span className="number">{result.carbonFootprint?.totalAnnualTons}</span>
                                <span className="unit">tons CO₂/year</span>
                            </div>
                            <p className="comparison">
                                {result.comparison?.percentOfAverage}% of US average ({result.comparison?.usAverage} tons)
                            </p>
                            <span className={`rating ${getRatingClass(result.comparison?.rating)}`}>
                                {result.comparison?.rating}
                            </span>
                        </div>

                        <div className="breakdown-card">
                            <h3>Emissions Breakdown</h3>
                            <div className="breakdown-bars">
                                {Object.entries(result.carbonFootprint?.breakdown || {}).map(([key, data]: [string, any]) => (
                                    <div key={key} className="bar-item">
                                        <div className="bar-label">
                                            <span>{formatLabel(key)}</span>
                                            <span>{data.emissionsTons || data.amortizedAnnualTons || 0} tons</span>
                                        </div>
                                        <div className="bar-track">
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    width: `${Math.min(100, ((data.emissionsTons || data.amortizedAnnualTons || 0) / result.carbonFootprint.totalAnnualTons) * 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="equivalents-card">
                            <h3>What This Equals</h3>
                            <div className="equivalents-grid">
                                <div className="equiv">
                                    <span className="emoji">🚗</span>
                                    <span className="value">{result.comparison?.equivalents?.carsOnRoad}</span>
                                    <span className="label">Cars on road for 1 year</span>
                                </div>
                                <div className="equiv">
                                    <span className="emoji">🌳</span>
                                    <span className="value">{result.comparison?.equivalents?.treesNeeded}</span>
                                    <span className="label">Trees needed to offset</span>
                                </div>
                                <div className="equiv">
                                    <span className="emoji">✈️</span>
                                    <span className="value">{(result.comparison?.equivalents?.milesFlown / 1000).toFixed(0)}K</span>
                                    <span className="label">Miles flown</span>
                                </div>
                            </div>
                        </div>

                        <div className="strategies-card">
                            <h3>Reduction Strategies</h3>
                            {result.reductionStrategies?.map((strat: any, i: number) => (
                                <div key={i} className="strategy-item">
                                    <div className="strategy-header">
                                        <span className="category">{strat.category}</span>
                                        <span className={`difficulty ${strat.difficulty.toLowerCase()}`}>{strat.difficulty}</span>
                                    </div>
                                    <h4>{strat.action}</h4>
                                    <div className="strategy-meta">
                                        <span>Reduction: {strat.potentialReduction}</span>
                                        <span>Saves: {strat.estimatedSavings}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="offset-card">
                            <h3>🌱 Offset Options</h3>
                            <div className="offset-grid">
                                {result.offsetOptions?.slice(0, 2).map((opt: any, i: number) => (
                                    <div key={i} className="offset-item">
                                        <h4>{opt.name}</h4>
                                        <p>{opt.description}</p>
                                        <div className="offset-price">${opt.totalCost}/year</div>
                                        <button className="offset-btn">Offset Now</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .carbon-page {
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
          background: linear-gradient(135deg, #22c55e, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .main-content {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 900px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }
        
        .form-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          height: fit-content;
          position: sticky;
          top: 2rem;
        }
        
        .form-card h2 {
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .form-group input[type="number"],
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
        }
        
        .form-group input[type="range"] {
          width: 100%;
        }
        
        .hint {
          font-size: 0.75rem;
          color: #64748b;
          display: block;
          margin-top: 0.25rem;
        }
        
        .range-value {
          font-weight: 500;
          color: #22c55e;
        }
        
        .form-card button {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #22c55e, #0ea5e9);
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
        
        .total-card, .breakdown-card, .equivalents-card, .strategies-card, .offset-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .total-card {
          text-align: center;
        }
        
        .total-value {
          margin: 1rem 0;
        }
        
        .total-value .number {
          font-size: 4rem;
          font-weight: 700;
          color: #22c55e;
        }
        
        .total-value .unit {
          display: block;
          font-size: 1.25rem;
          color: #64748b;
        }
        
        .comparison {
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        
        .rating {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .rating.good {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .rating.average {
          background: #fef3c7;
          color: #d97706;
        }
        
        .rating.high {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .bar-item {
          margin-bottom: 1rem;
        }
        
        .bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .bar-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #0ea5e9);
          border-radius: 4px;
        }
        
        .equivalents-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        .equiv {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
        }
        
        .equiv .emoji {
          font-size: 2rem;
          display: block;
        }
        
        .equiv .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          display: block;
        }
        
        .equiv .label {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .strategy-item {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }
        
        .strategy-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .strategy-header .category {
          font-size: 0.75rem;
          color: #6366f1;
          font-weight: 500;
        }
        
        .difficulty {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
        }
        
        .difficulty.easy {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .difficulty.medium {
          background: #fef3c7;
          color: #d97706;
        }
        
        .difficulty.high {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .strategy-item h4 {
          margin: 0 0 0.5rem;
          font-size: 0.95rem;
        }
        
        .strategy-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #64748b;
        }
        
        .offset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .offset-item {
          padding: 1rem;
          background: #ecfdf5;
          border-radius: 8px;
          text-align: center;
        }
        
        .offset-item h4 {
          margin: 0 0 0.5rem;
        }
        
        .offset-item p {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }
        
        .offset-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 0.75rem;
        }
        
        .offset-btn {
          padding: 0.5rem 1rem;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}

function getRatingClass(rating: string): string {
    if (rating?.includes('Below')) return 'good';
    if (rating?.includes('Average')) return 'average';
    return 'high';
}

function formatLabel(key: string): string {
    const labels: Record<string, string> = {
        electricity: '⚡ Electricity',
        naturalGas: '🔥 Natural Gas',
        embodiedCarbon: '🏗️ Embodied Carbon',
        commute: '🚗 Commute'
    };
    return labels[key] || key;
}
