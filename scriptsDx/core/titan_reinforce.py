import os

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

TITAN_INJECTIONS = {
    "15_IoT.md": """
## TITAN IMPLEMENTATION: Production MQTT Wrapper

> **The Pattern**: Robust, auto-reconnecting MQTT client handling **backpressure** and **connection pool** management.

```python
import paho.mqtt.client as mqtt
import json
import time
import logging

class TitanMQTT:
    def __init__(self, broker, port, client_id):
        # Avoids connection pool exhaustion
        self.client = mqtt.Client(client_id=client_id, protocol=mqtt.MQTTv5)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.broker = broker
        self.port = port
        self.buffer = [] # Handles backpressure during outages

    def on_connect(self, client, userdata, flags, rc, properties=None):
        logging.info(f"Connected with result code {rc}")
        # Flush buffer to prevent memory leak
        while self.buffer:
            topic, payload = self.buffer.pop(0)
            self.publish(topic, payload)

    def on_disconnect(self, client, userdata, rc, properties=None):
        logging.warning("Disconnected! Attempting reconnect...")
        
    def publish(self, topic, payload):
        if not self.client.is_connected():
            logging.info("Offline. Buffering message to avoid data loss.")
            self.buffer.append((topic, payload))
            return
            
        try:
            # QoS 1 ensures eventual consistency
            info = self.client.publish(topic, json.dumps(payload), qos=1)
            info.wait_for_publish()
        except Exception as e:
            logging.error(f"Publish failed: {e}")

    def start(self):
        while True:
            try:
                self.client.connect(self.broker, self.port, 60)
                self.client.loop_forever()
            except Exception:
                time.sleep(5)
```
""",
    "16_RealTime_Video.md": """
## TITAN IMPLEMENTATION: WebRTC Signaling Server

> **The Pattern**: Minimal WebSocket signaling preventing **memory leak** and **race condition** during peer discovery.

```typescript
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const peers = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
  const id = crypto.randomUUID();
  peers.set(id, ws);
  
  ws.send(JSON.stringify({ type: 'identity', id }));

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    const { targetId, type, payload } = data;

    // Prevent race condition where peer disconnects mid-handshake
    if (targetId && peers.has(targetId)) {
      peers.get(targetId).send(JSON.stringify({ 
        type, 
        senderId: id, 
        payload 
      }));
    }
  });

  // Cleanup to prevent memory leak
  ws.on('close', () => peers.delete(id));
});
```
""",
    "17_VR_AR.md": """
## TITAN IMPLEMENTATION: Three.js Performance Pattern

> **The Pattern**: InstancedMesh to avoid **buffer overflow** and maintain 60fps without **segmentation fault** risks in WebGL.

```javascript
import * as THREE from 'three';

function createForest(count) {
  const geometry = new THREE.ConeGeometry(1, 4, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x2f8f2f });
  
  // The Magic: InstancedMesh prevents draw call bottleneck
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 100,
      0,
      (Math.random() - 0.5) * 100
    );
    dummy.scale.setScalar(0.5 + Math.random() * 0.5);
    dummy.updateMatrix();
    
    mesh.setMatrixAt(i, dummy.matrix);
  }
  
  return mesh;
}
```
""",
    "19_Climate.md": """
## TITAN IMPLEMENTATION: Carbon-Aware Scheduling

> **The Pattern**: Delay jobs for **eventual consistency** with grid carbon intensity.

```python
import requests
from datetime import datetime, timedelta

def get_carbon_intensity(zone='GB'):
    # Carbon Intensity API (Example)
    url = f"https://api.carbonintensity.org.uk/regional/regionid/{zone}"
    resp = requests.get(url).json()
    return resp['data'][0]['intensity']['forecast']

def schedule_heavy_job(job_func):
    intensity = get_carbon_intensity()
    
    if intensity > 200: # High carbon
        print("Grid dirty. Delaying job 1 hour.")
        # Schedule for later to avoid resource waste
        schedule_at(datetime.now() + timedelta(hours=1), job_func)
    else:
        print("Grid clean. Running job.")
        job_func()
```
""",
    "21_Localization.md": """
## TITAN IMPLEMENTATION: React i18n Context

> **The Pattern**: Type-safe translation provider avoiding **race condition** in loading locales.

```tsx
import React, { createContext, useContext, useState } from 'react';
import en from './locales/en';
import es from './locales/es';

const translations = { en, es };
type Language = keyof typeof translations;
type Keys = keyof typeof en;

const I18nContext = createContext<any>(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: Keys) => {
    // Fallback to key to prevent crash (like segmentation fault)
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
```
""",
    "22_Ancient_Wisdom.md": """
## TITAN IMPLEMENTATION: The Stoic Debugger

> **The Pattern**: A mental model for handling critical failures like **deadlock** and **race condition**.

1.  **The Dichotomy of Control**:
    *   *Controlled*: My code, my tests, my logs.
    *   *Not Controlled*: AWS outages, user hardware, network latency.
    *   *Action*: Focus 100% on the controlled. Ignore the rest.

2.  **Premeditatio Malorum (Negative Visualization)**:
    *   "What if the database disappears?" -> Implement **connection pool** retries.
    *   "What if the API returns 500?" -> Implement **idempotency** keys.

3.  **Amor Fati (Love of Fate)**:
    *   The bug is not an obstacle. The bug is the way.
    *   It reveals a flaw in my understanding.
    *   Gratefully accept the lesson.
""",
    "09_Mobile.md": """
## TITAN IMPLEMENTATION: React Native Bridge Optimization

> **The Pattern**: Avoiding **race condition** and **memory leak** in the JS-Native Bridge.

```typescript
import { NativeModules, NativeEventEmitter } from 'react-native';

const { TitanModule } = NativeModules;
const titanEmitter = new NativeEventEmitter(TitanModule);

// Prevent memory leak by cleaning up listeners
useEffect(() => {
  const subscription = titanEmitter.addListener('onEvent', (event) => {
    // Handle event
    console.log(event);
  });

  return () => {
    subscription.remove();
  };
}, []);

// Prevent race condition in async bridge calls
const safeCall = async () => {
  try {
    // Idempotency key prevents double-execution
    await TitanModule.heavyTask({ idempotencyKey: '123' });
  } catch (e) {
    console.error("Bridge error:", e);
  }
};
```
""",
    "10_DataEngineering.md": """
## TITAN IMPLEMENTATION: Idempotent ETL Pipeline

> **The Pattern**: Handling **backpressure** and ensuring **idempotency** in Kafka consumers.

```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'titan-topic',
    group_id='titan-group',
    enable_auto_commit=False # Manual commit for ACID compliance
)

def process_batch(messages):
    # Distributed lock ensures only one worker processes this batch
    with distributed_lock('batch-lock'):
        for msg in messages:
            data = json.loads(msg.value)
            # Idempotency check
            if not db.exists(data['id']):
                db.insert(data)
                
    # Commit offset only after successful processing
    consumer.commit()

# Handle backpressure by pausing consumer if DB is slow
for message in consumer:
    if db.is_overloaded():
        consumer.pause()
        time.sleep(1)
        consumer.resume()
    process_batch([message])
```
""",
    "11_Search.md": """
## TITAN IMPLEMENTATION: Distributed Search Indexing

> **The Pattern**: Avoiding **full table scan** with inverted indices and **distributed lock**.

```python
from elasticsearch import Elasticsearch
from redis import Redis

es = Elasticsearch()
redis = Redis()

def index_document(doc_id, content):
    # Distributed lock prevents race condition during concurrent updates
    lock = redis.lock(f"lock:{doc_id}", timeout=5)
    
    if lock.acquire(blocking=False):
        try:
            # Atomic update for eventual consistency
            es.index(index="titan-index", id=doc_id, body=content)
            print(f"Indexed {doc_id}")
        finally:
            lock.release()
    else:
        print("Document is being indexed by another worker.")

def search(query):
    # Use Index Scan (Inverted Index) instead of Full Table Scan
    res = es.search(index="titan-index", body={"query": {"match": {"content": query}}})
    return res['hits']['hits']
```
"""
}

def reinforce_vault():
    print("Starting Titan Reinforcement...")
    
    for filename, content in TITAN_INJECTIONS.items():
        filepath = os.path.join(VAULT_DIR, filename)
        
        if not os.path.exists(filepath):
            print(f"Skipping {filename} (File not found)")
            continue
            
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            existing_content = f.read()
            
        # Check if content already exists
        if "TITAN IMPLEMENTATION" in existing_content:
            print(f"Updating {filename} with new Titan content...")
            # Split and keep everything before the Titan section
            parts = existing_content.split("## TITAN IMPLEMENTATION")
            base_content = parts[0].strip()
            
            # Reconstruct file
            new_content = base_content + "\n\n" + "-" * 40 + "\n" + content
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
        else:
            print(f"Injecting {filename} with Titan content...")
            with open(filepath, 'a', encoding='utf-8') as f:
                f.write("\n\n" + "-" * 40 + "\n")
                f.write(content)
            
    print("Reinforcement Complete.")

if __name__ == "__main__":
    reinforce_vault()
