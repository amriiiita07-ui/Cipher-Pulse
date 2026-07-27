-- CipherPulse: Confidential Compliance AI — Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. communications_raw
--    Stores original message + metadata from ETL ingestion.
-- ============================================================
CREATE TABLE IF NOT EXISTS communications_raw (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source          VARCHAR(50)   NOT NULL DEFAULT 'simulated',
    timestamp       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    sender_id       VARCHAR(100),
    sender_role     VARCHAR(100),
    team            VARCHAR(100),
    channel_id      VARCHAR(100),
    message_text    TEXT          NOT NULL,
    is_flagged      BOOLEAN       DEFAULT FALSE,
    flag_reason     VARCHAR(255),
    ingested_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_raw_timestamp     ON communications_raw (timestamp);
CREATE INDEX idx_raw_sender        ON communications_raw (sender_id);
CREATE INDEX idx_raw_team          ON communications_raw (team);
CREATE INDEX idx_raw_flagged       ON communications_raw (is_flagged);

-- ============================================================
-- 2. communications_scored
--    Stores ML output for each analysed message.
-- ============================================================
CREATE TABLE IF NOT EXISTS communications_scored (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_id          UUID          NOT NULL REFERENCES communications_raw(id) ON DELETE CASCADE,
    risk_score      FLOAT         NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    labels          JSONB         NOT NULL DEFAULT '[]',
    explanation     JSONB         NOT NULL DEFAULT '{}',
    model_version   VARCHAR(50)   NOT NULL DEFAULT 'v1-tfidf-lr',
    scored_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scored_raw_id     ON communications_scored (raw_id);
CREATE INDEX idx_scored_risk       ON communications_scored (risk_score);
CREATE INDEX idx_scored_labels     ON communications_scored USING GIN (labels);

-- ============================================================
-- 3. reviews
--    Human-in-the-loop feedback on flagged messages.
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_id          UUID          NOT NULL REFERENCES communications_raw(id) ON DELETE CASCADE,
    review_status   VARCHAR(30)   NOT NULL DEFAULT 'open'
                    CHECK (review_status IN ('open', 'dismissed', 'escalated', 'confirmed')),
    reviewer        VARCHAR(100),
    feedback        VARCHAR(30)
                    CHECK (feedback IN ('true_positive', 'false_positive', 'needs_more_info')),
    notes           TEXT,
    reviewed_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_raw_id    ON reviews (raw_id);
CREATE INDEX idx_reviews_status    ON reviews (review_status);

-- ============================================================
-- 4. Helpful view: joined alerts with scores + reviews
-- ============================================================
CREATE OR REPLACE VIEW v_alerts AS
SELECT
    cr.id                AS raw_id,
    cr.source,
    cr.timestamp,
    cr.sender_id,
    cr.sender_role,
    cr.team,
    cr.message_text,
    cs.risk_score,
    cs.labels,
    cs.explanation,
    cs.model_version,
    cs.scored_at,
    r.review_status,
    r.reviewer,
    r.feedback,
    r.notes,
    r.reviewed_at
FROM communications_raw cr
LEFT JOIN communications_scored cs ON cs.raw_id = cr.id
LEFT JOIN reviews r                ON r.raw_id  = cr.id;
