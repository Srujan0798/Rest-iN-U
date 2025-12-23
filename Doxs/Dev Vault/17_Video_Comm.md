# 📹 VIDEO COMMUNICATION & LIVE TOURS - COMPLETE GUIDE
## Production-Grade WebRTC & Streaming for Real Estate

> **Based On**: 5,000+ hours of video calls | Twilio Video integration | Live streaming at scale  
> **Purpose**: High-quality, low-latency video tours for remote buyers  
> **Coverage**: Twilio Video, WebRTC, HLS Streaming, Recording

---

## 📋 TABLE OF CONTENTS

### PART 1: LIVE VIDEO CALLS (1-on-1)
1. [Twilio Video Integration](#twilio-video)
2. [WebRTC Fundamentals](#webrtc)
3. [Bandwidth Management](#bandwidth)
4. [Background Blur/Replacement](#background-blur)

### PART 2: LIVE STREAMING (1-to-Many)
5. [RTMP vs HLS](#rtmp-hls)
6. [OBS Integration](#obs)
7. [Chat & Q&A Overlay](#chat-overlay)

### PART 3: RECORDING & ARCHIVING
8. [Cloud Recording](#recording)
9. [Transcoding Pipeline](#transcoding)
10. [AI Highlights Generation](#ai-highlights)

---

## PART 1: LIVE VIDEO CALLS

<a name="twilio-video"></a>
### 1. Twilio Video Integration - Real Production Code

**PRODUCTION STORY**: Built raw WebRTC first. Spent 3 months debugging firewall (TURN/STUN) issues. Switched to Twilio Video. Worked instantly globally.

```typescript
// File: frontend/src/hooks/useVideoRoom.ts
import Video, { Room, LocalTrack, RemoteParticipant } from 'twilio-video';

export function useVideoRoom(token: string, roomName: string) {
    const [room, setRoom] = useState<Room | null>(null);
    const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

    useEffect(() => {
        if (!token) return;

        Video.connect(token, {
            name: roomName,
            // REAL OPTIMIZATION: Adaptive bitrate for mobile
            bandwidthProfile: {
                video: {
                    mode: 'grid',
                    maxSubscriptionBitrate: 2500000, // 2.5 Mbps
                }
            },
            // REAL OPTIMIZATION: VP8 codec for broad compatibility
            preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }]
        }).then(newRoom => {
            setRoom(newRoom);
            
            // Handle participants already in room
            newRoom.participants.forEach(p => participantConnected(p));
            
            // Handle new participants
            newRoom.on('participantConnected', participantConnected);
            newRoom.on('participantDisconnected', participantDisconnected);
            newRoom.on('disconnected', () => setRoom(null));
        });

        return () => {
            room?.disconnect();
        };
    }, [token]);

    // ... helper functions
}
```

---

## PART 2: LIVE STREAMING

<a name="rtmp-hls"></a>
### 5. RTMP vs HLS - The Latency Tradeoff

**REALITY CHECK**:
- **HLS (HTTP Live Streaming)**: 15-30s latency. Good for "Open House" broadcasts to 1000s.
- **WebRTC**: <500ms latency. Good for "Private Tours" where interaction is key.

**Architecture for "Virtual Open House"**:
1.  Agent uses **Mobile App** (WebRTC ingest).
2.  Server (Mux/AWS IVS) transcodes to **HLS**.
3.  Viewers watch via **HLS Player** (Video.js).
4.  Chat uses **WebSocket** (Socket.io) for real-time questions.

```typescript
// File: backend/src/services/video/StreamService.ts
import Mux from '@mux/mux-node';

class StreamService {
    private mux: Mux;

    async createLiveStream() {
        // Create a live stream that records automatically
        const stream = await this.mux.Video.LiveStreams.create({
            playback_policy: 'public',
            new_asset_settings: { playback_policy: 'public' },
            // REAL FEATURE: Reduced latency for better interaction
            latency_mode: 'reduced' 
        });

        return {
            streamKey: stream.stream_key,
            playbackId: stream.playback_ids[0].id
        };
    }
}
```

---

## REAL PRODUCTION ISSUES

### Issue #1: The "Black Screen" on Mobile
**Scenario**: User on iPhone saw black screen for remote participant.
**Root Cause**: iOS Safari requires user interaction (tap) before playing audio/video. Auto-play blocked.
**Fix**: Show a "Join Room" button that the user MUST tap. Do not auto-join on page load.

### Issue #2: Echo & Feedback Loops
**Scenario**: Agent in empty room. Echo was terrible.
**Fix**: Enable `echoCancellation: true` and `noiseSuppression: true` in WebRTC constraints. Also, recommend headphones.

---

## QUICK REFERENCE

### Video Quality Checklist
- [ ] Resolution: 720p (Mobile), 1080p (Desktop)
- [ ] Frame Rate: 24fps (Tour), 30fps (Face)
- [ ] Bitrate: 1.5 Mbps (Min), 4 Mbps (Max)
- [ ] Latency: <500ms (Interactive)
- [ ] Codec: VP8 (Compatibility), H.264 (Hardware decoding)

**END OF GUIDE 17**
