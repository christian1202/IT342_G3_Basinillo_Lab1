-- ============================================================
-- PortKey — Database Migration V001
-- ============================================================
-- Purpose:
--   1. Drop legacy prototype tables (attendance, products)
--   2. Create the core PortKey domain tables:
--      - shipments       (shipment tracking)
--      - shipment_documents (document management)
--
-- Run this script in the Supabase SQL Editor BEFORE
-- restarting the Spring Boot backend.
-- ============================================================


-- ──────────────────────────────────────────────
-- STEP 1: CLEANUP — Drop legacy tables
-- ──────────────────────────────────────────────

DROP TABLE IF EXISTS attendance     CASCADE;
DROP TABLE IF EXISTS products       CASCADE;


-- ──────────────────────────────────────────────
-- STEP 2: Enable UUID extension (idempotent)
-- ──────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ──────────────────────────────────────────────
-- STEP 3: CREATE shipments table
-- ──────────────────────────────────────────────

CREATE TABLE shipments (
    id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Owner of this shipment (references the profiles table synced from Supabase Auth)
    user_id           UUID          NOT NULL
                                    REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Bill of Lading number — the unique identifier for a shipment in logistics
    bl_number         VARCHAR(50)   NOT NULL UNIQUE,

    -- Vessel / ship name carrying the cargo
    vessel_name       VARCHAR(150),

    -- Container identification number (e.g., "MSKU1234567")
    container_number  VARCHAR(50),

    -- Estimated Time of Arrival
    arrival_date      TIMESTAMPTZ,

    -- Current shipment lifecycle status
    status            VARCHAR(30)   NOT NULL DEFAULT 'PENDING',

    -- Record creation timestamp
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by owner
CREATE INDEX idx_shipments_user_id ON shipments(user_id);


-- ──────────────────────────────────────────────
-- STEP 4: CREATE shipment_documents table
-- ──────────────────────────────────────────────

CREATE TABLE shipment_documents (
    id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Parent shipment — cascading delete removes documents when shipment is deleted
    shipment_id       UUID          NOT NULL
                                    REFERENCES shipments(id) ON DELETE CASCADE,

    -- Type of document: 'INVOICE', 'PACKING_LIST', 'BILL_OF_LADING', etc.
    document_type     VARCHAR(50)   NOT NULL,

    -- URL to the file stored in Supabase Storage
    file_url          TEXT          NOT NULL,

    -- Record creation timestamp
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by parent shipment
CREATE INDEX idx_shipment_documents_shipment_id ON shipment_documents(shipment_id);
