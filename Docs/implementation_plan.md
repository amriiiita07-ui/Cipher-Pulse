# CipherPulse — Implementation Plan

## Overview
Building an end-to-end RegTech compliance surveillance platform with:
- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **ML**: TF-IDF + LogisticRegression (scikit-learn)
- **ETL**: Python scripts for data generation, loading, and batch scoring
- **UI**: React + Vite (Compliance Review Dashboard)
- **Analytics**: Plotly Dash (Leadership KPI Dashboard)
- **Infra**: Docker Compose (PostgreSQL)

## Phases

### Phase 0 — Infrastructure Setup ⬜
- [x] Create folder structure
- [x] `infra/sql/schema.sql`
- [x] `infra/docker-compose.yml`
- [x] Backend `requirements.txt`
- [x] ETL `requirements.txt`
- [x] Dashboard `requirements.txt`

### Phase 1 — Data Generation ⬜
- [x] `etl/generate_data.py` — Generate 1500+ realistic messages
- [x] Output: `data/generated_messages.csv`

### Phase 2 — ETL Load ⬜
- [x] `etl/etl_load_raw.py` — Load CSV → PostgreSQL `communications_raw`

### Phase 3 — ML Training ⬜
- [x] `backend/app/ml/vectorizer.py`
- [x] `backend/app/ml/model.py`
- [x] `etl/train_model.py` — Train TF-IDF + LogisticRegression
- [x] Output: `backend/app/ml/artifacts/model.pkl`, `vectorizer.pkl`, `labels.json`

### Phase 4 — Batch Scoring ⬜
- [x] `etl/score_batch.py` — Score all raw messages → `communications_scored`
- [x] `backend/app/ml/explain.py` — Explanation/reason extraction

### Phase 5 — Backend API ⬜
- [x] `backend/app/core/config.py`
- [x] `backend/app/db/session.py`
- [x] `backend/app/db/models.py`
- [x] `backend/app/db/crud.py`
- [x] `backend/app/api/routes_analyze.py`
- [x] `backend/app/api/routes_messages.py`
- [x] `backend/app/api/routes_feedback.py`
- [x] `backend/app/main.py`

### Phase 6 — Compliance Review UI ⬜
- [x] React + Vite project setup
- [x] `ui/src/api/client.js`
- [x] `ui/src/components/MessageComposer.jsx`
- [x] `ui/src/components/AlertsTable.jsx`
- [x] `ui/src/components/ReviewModal.jsx`
- [x] `ui/src/pages/Inbox.jsx`
- [x] `ui/src/App.jsx`
- [x] Styling (CSS)

### Phase 7 — Analytics Dashboard ⬜
- [x] `dashboard/queries.py`
- [x] `dashboard/app.py` — Plotly Dash

## Startup Order
1. `docker-compose up -d` (PostgreSQL)
2. Apply `schema.sql`
3. Run `generate_data.py` → `etl_load_raw.py` → `train_model.py` → `score_batch.py`
4. Start backend: `uvicorn backend.app.main:app --reload`
5. Start UI: `cd ui && npm run dev`
6. Start Dashboard: `python dashboard/app.py`
