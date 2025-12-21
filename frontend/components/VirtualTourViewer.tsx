'use client';

import { useState, useEffect } from 'react';
import { FaExpand, FaCompress, FaVrCardboard, FaInfo, FaShare, FaPlay } from 'react-icons/fa';

interface VirtualTourViewerProps {
    propertyId: string;
    matterportId?: string;
    embedUrl?: string;
    provider?: 'matterport' | 'zillow3d' | 'custom' | 'metaverse';
    showControls?: boolean;
    height?: string;
}

interface TourData {
    id: string;
    embedUrl: string;
    showcaseUrl: string;
    provider: string;
    viewCount: number;
    hotspots?: any[];
}

export default function VirtualTourViewer({
    propertyId,
    matterportId,
    embedUrl,
    provider = 'matterport',
    showControls = true,
    height = '500px'
}: VirtualTourViewerProps) {
    const [tour, setTour] = useState<TourData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (embedUrl) {
            setTour({
                id: 'custom',
                embedUrl,
                showcaseUrl: embedUrl,
                provider,
                viewCount: 0
            });
            setLoading(false);
            return;
        }

        // Fetch tour data from API
        const fetchTour = async () => {
            try {
                const response = await fetch(`/api/v1/virtual-tours/property/${propertyId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('No virtual tour available for this property');
                    } else {
                        throw new Error('Failed to load virtual tour');
                    }
                    return;
                }
                const data = await response.json();
                setTour(data.tour);

                // Track view
                fetch('/api/v1/virtual-tours/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tourId: data.tour.id,
                        eventType: 'view',
                        deviceType: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
                    })
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [propertyId, embedUrl]);

    const toggleFullscreen = () => {
        const container = document.getElementById('tour-container');
        if (!container) return;

        if (!isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const handleShare = async () => {
        if (!tour) return;

        const shareUrl = tour.showcaseUrl || window.location.href;

        if (navigator.share) {
            await navigator.share({
                title: 'Virtual Property Tour',
                text: 'Check out this amazing property!',
                url: shareUrl
            });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert('Tour link copied to clipboard!');
        }

        // Track share event
        fetch('/api/v1/virtual-tours/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tourId: tour.id,
                eventType: 'share'
            })
        });
    };

    const openVRMode = () => {
        if (!tour) return;
        // Open in VR-compatible URL
        const vrUrl = tour.embedUrl.includes('?')
            ? `${tour.embedUrl}&vr=1`
            : `${tour.embedUrl}?vr=1`;
        window.open(vrUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="tour-loading" style={{ height }}>
                <div className="spinner" />
                <p>Loading virtual tour...</p>
                <style jsx>{`
          .tour-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1e293b, #334155);
            border-radius: 12px;
            color: white;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="tour-error" style={{ height }}>
                <FaVrCardboard size={48} />
                <h3>Virtual Tour Not Available</h3>
                <p>{error || 'No tour data found'}</p>
                <style jsx>{`
          .tour-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            border: 2px dashed #e2e8f0;
            border-radius: 12px;
            color: #64748b;
            text-align: center;
            padding: 2rem;
          }
          h3 { margin: 1rem 0 0.5rem; color: #334155; }
        `}</style>
            </div>
        );
    }

    return (
        <div id="tour-container" className="virtual-tour-container" style={{ height }}>
            <iframe
                src={tour.embedUrl}
                title="Virtual Property Tour"
                allowFullScreen
                allow="xr-spatial-tracking; gyroscope; accelerometer"
            />

            {showControls && (
                <div className="tour-controls">
                    <button onClick={toggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    <button onClick={openVRMode} title="View in VR">
                        <FaVrCardboard />
                    </button>
                    <button onClick={() => setShowInfo(!showInfo)} title="Tour Info">
                        <FaInfo />
                    </button>
                    <button onClick={handleShare} title="Share Tour">
                        <FaShare />
                    </button>
                </div>
            )}

            {showInfo && (
                <div className="tour-info">
                    <h4>Virtual Tour</h4>
                    <p>Provider: {tour.provider}</p>
                    <p>Views: {tour.viewCount}</p>
                    {tour.hotspots && <p>Hotspots: {tour.hotspots.length}</p>}
                    <button onClick={() => setShowInfo(false)}>Close</button>
                </div>
            )}

            <style jsx>{`
        .virtual-tour-container {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #1e293b;
        }
        
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .tour-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }
        
        .tour-controls button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tour-controls button:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.05);
        }
        
        .tour-info {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          max-width: 250px;
        }
        
        .tour-info h4 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }
        
        .tour-info p {
          margin: 0.25rem 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }
        
        .tour-info button {
          margin-top: 0.75rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
