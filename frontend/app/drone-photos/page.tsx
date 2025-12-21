'use client';

import { useState } from 'react';

interface Package {
    id: string;
    name: string;
    price: number;
    photos: number;
    videos: number;
    features: string[];
}

const PACKAGES: Package[] = [
    {
        id: 'basic',
        name: 'Basic Package',
        price: 149,
        photos: 20,
        videos: 1,
        features: ['20 aerial photos', '1 property video (30 sec)', 'Basic editing']
    },
    {
        id: 'premium',
        name: 'Premium Package',
        price: 299,
        photos: 40,
        videos: 3,
        features: [
            '40 aerial photos',
            '3 videos (intro, flyover, close-up)',
            '360° panorama',
            'Professional editing',
            'Same-day delivery'
        ]
    },
    {
        id: 'luxury',
        name: 'Luxury Package',
        price: 599,
        photos: 100,
        videos: 10,
        features: [
            '100 aerial photos',
            '10 videos including twilight shots',
            '3D property model',
            'Matterport-style walkthrough',
            'Cinematic editing',
            'Rush 24-hour delivery',
            'Social media cuts'
        ]
    }
];

export default function DronePhotosPage() {
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [showOrderForm, setShowOrderForm] = useState(false);

    const handleSelectPackage = (id: string) => {
        setSelectedPackage(id);
        setShowOrderForm(true);
    };

    return (
        <div className="drone-page">
            <header className="hero">
                <h1>📷 Drone Photography</h1>
                <p>Stunning aerial photos that make your listing stand out</p>
            </header>

            <div className="packages-grid">
                {PACKAGES.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                    >
                        {pkg.id === 'premium' && <span className="popular-badge">Most Popular</span>}

                        <h2>{pkg.name}</h2>
                        <div className="price">
                            <span className="amount">${pkg.price}</span>
                            <span className="per">per property</span>
                        </div>

                        <div className="stats">
                            <div className="stat">
                                <span className="value">{pkg.photos}</span>
                                <span className="label">Photos</span>
                            </div>
                            <div className="stat">
                                <span className="value">{pkg.videos}</span>
                                <span className="label">Videos</span>
                            </div>
                        </div>

                        <ul className="features">
                            {pkg.features.map((feature, i) => (
                                <li key={i}>✓ {feature}</li>
                            ))}
                        </ul>

                        <button onClick={() => handleSelectPackage(pkg.id)}>
                            Select Package
                        </button>
                    </div>
                ))}
            </div>

            {showOrderForm && (
                <div className="order-modal">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowOrderForm(false)}>×</button>
                        <h2>Schedule Drone Photos</h2>
                        <p>Package: {PACKAGES.find(p => p.id === selectedPackage)?.name}</p>

                        <form>
                            <div className="form-group">
                                <label>Property Address</label>
                                <input type="text" placeholder="123 Main St, Miami, FL" required />
                            </div>

                            <div className="form-group">
                                <label>Preferred Date</label>
                                <input type="date" required />
                            </div>

                            <div className="form-group">
                                <label>Preferred Time</label>
                                <select>
                                    <option value="morning">Morning (6am - 10am)</option>
                                    <option value="afternoon">Afternoon (12pm - 4pm)</option>
                                    <option value="golden_hour">Golden Hour (5pm - 7pm)</option>
                                    <option value="twilight">Twilight (7pm - 8pm)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Special Instructions</label>
                                <textarea placeholder="Any specific shots or areas to focus on?"></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                Place Order - ${PACKAGES.find(p => p.id === selectedPackage)?.price}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .drone-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .hero {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .hero p {
          color: #64748b;
          font-size: 1.125rem;
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .package-card {
          position: relative;
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s;
        }
        
        .package-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .package-card.selected {
          border-color: #6366f1;
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          right: 16px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .package-card h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .price {
          margin-bottom: 1.5rem;
        }
        
        .price .amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .price .per {
          color: #64748b;
          font-size: 0.875rem;
          margin-left: 0.25rem;
        }
        
        .stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat .value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: #6366f1;
        }
        
        .stat .label {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }
        
        .features li {
          padding: 0.5rem 0;
          color: #374151;
          font-size: 0.9rem;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .package-card button {
          width: 100%;
          padding: 0.875rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .package-card button:hover {
          background: #334155;
        }
        
        .order-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          position: relative;
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }
        
        .modal-content h2 {
          margin-bottom: 0.5rem;
        }
        
        .modal-content > p {
          color: #6366f1;
          font-weight: 500;
          margin-bottom: 1.5rem;
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
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .submit-btn {
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
      `}</style>
        </div>
    );
}
