# 🚀 Future Roadmap & Pending Implementations

> **Source**: Extracted from "1 Raw imp", "2 Deep Dive Points", and "3 Unq integ".
> **Status**: These features are part of the long-term vision but are **not yet implemented** in the current codebase (which focuses on Core Backend Logic).

---

## 1. 🌐 Metaverse & VR/AR Integration
*From Document 3*

*   **Metaverse Property Twins**: Create full 3D replicas of properties in Decentraland/Sandbox.
*   **Unity/Unreal Engine Bridge**: Need to build a bridge between the backend property data and a Unity-based VR viewer.
*   **Holographic Agent Meetings**: AR feature for agents to appear as holograms.
*   **Virtual Staging Studio**: Tool for users to drag-and-drop virtual furniture in VR.

## 2. 📡 Hardware IoT & Sensor Network
*From Document 3*

*   **Physical Sensor Integration**: The current codebase has the *data structure* for IoT, but requires actual drivers for:
    *   PurpleAir API (Air Quality)
    *   Hardware water quality testers
    *   Seismic sensors
*   **Edge Computing**: Processing sensor data locally on the property before sending to cloud.

## 3. ⚖️ Legal & International Compliance
*From Document 1 & 3*

*   **Multi-Jurisdiction Smart Contracts**: The current smart contracts are generic. We need specific adaptations for:
    *   Dubai Land Department blockchain integration.
    *   Indian real estate laws (RERA).
    *   European GDPR & Property laws.
*   **Cross-Border Tax Engine**: Automatic calculation of international property taxes and inheritance laws.

## 4. 🧠 Advanced AI Models
*From Document 2 & 3*

*   **Computer Vision Training**: The current Vastu service uses a *simulation* of CV. We need to train a real TensorFlow/PyTorch model on thousands of floor plans to actually detect rooms from images.
*   **Voice Cloning**: Feature to clone agent voices for auto-narrated tours.
*   **Deepfake Detection**: AI model to verify listing photos are not AI-generated.

## 5. 📱 Mobile & Frontend
*From Document 1*

*   **React Native App**: The `mobile/` folder exists but needs full implementation of the Vastu and Blockchain features.
*   **AR Furniture Placement**: Mobile camera integration for placing virtual objects.

## 6. 🌍 Community & DAO
*From Document 3*

*   **Voting Interface**: Frontend UI for DAO members to vote on neighborhood improvements.
*   **Token Economics**: Full implementation of the token economy (staking, rewards) beyond the basic smart contracts.

---

**Note**: The *Core Logic* for Vastu (Rules Engine), Climate (Risk Modeling), and Blockchain (Registry/Escrow) **IS IMPLEMENTED** in the backend services. This roadmap covers the *expansions* required to reach the full "Unq integ" vision.
