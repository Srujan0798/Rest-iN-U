# BRAIN - THE ACTIVE INTELLIGENCE CORE

## The "Injection" System (Reactive Problem Solving)

> **Last Updated:** December 30, 2024
> **Status:** ACTIVELY EXPANDING
> **Purpose:** To bridge the gap between "Having Data" and "Thinking Like a Senior Dev".

---

## CORE PROCESSORS (THE METHOD)

| # | Component | File | Purpose | Status |
|---|-----------|------|---------|--------|
| 01 | **Recognition** | [ROOT_CAUSE_DATABASE.md](./ROOT_CAUSE_DATABASE.md) | "I've seen this error before." | ✅ GOLD |
| 02 | **Diagnosis** | [DECISION_TREES.md](./DECISION_TREES.md) | "If X, check Y, then Z." | ✅ GOLD |
| 03 | **Connection** | [DEPENDENCY_MAPS.md](./DEPENDENCY_MAPS.md) | "Changing Auth affects Middleware." | ✅ GOLD |
| 04 | **Verification** | [CHECKLISTS.md](./CHECKLISTS.md) | "Did I miss anything?" | ✅ GOLD |
| 05 | **Activation** | [BRAIN_ACTIVATION_SYSTEM.md](./BRAIN_ACTIVATION_SYSTEM.md) | The Master Workflow. | ✅ GOLD |

---

## THE WORKFLOW (HOW TO THINK)

```mermaid
graph TD
A[ERROR OCCURS] --> B{Recognize Pattern?}
B -- Yes --> C[ROOT_CAUSE_DATABASE]
B -- No --> D[DECISION_TREES]
C --> E[Apply Fix]
D --> E
E --> F[DEPENDENCY_MAPS]
F --> G[CHECKLISTS]
G --> H[VERIFIED FIX]
```text

---


> **The "Senior Dev" Standard**
>
> - **No Generic Advice**: "Check logs" is useless. "Check `/var/log/nginx/error.log` for 502s" is gold.
> - **Real War Stories**: Patterns derived from actual production outages.
> - **Cross-Cutting**: Always link to related systems (DB, Cache, UI).

---

### "AI has the data. BRAIN gives it the method."
