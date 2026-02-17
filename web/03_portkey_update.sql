/* 
 * 03_portkey_update.sql
 * 
 * RUN THIS IN THE SUPABASE SQL EDITOR
 * 
 * Adds business fields for the Customs Brokerage System.
 */

-- Add 'service_fee' column for revenue tracking
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shipments' AND column_name = 'service_fee') THEN
        ALTER TABLE shipments ADD COLUMN service_fee DECIMAL(10,2) DEFAULT 0.00;
    END IF;
END $$;

-- Add 'client_name' column for client tracking
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shipments' AND column_name = 'client_name') THEN
        ALTER TABLE shipments ADD COLUMN client_name TEXT;
    END IF;
END $$;
