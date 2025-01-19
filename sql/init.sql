-- Enable Row Level Security
ALTER TABLE IF EXISTS "public"."demandes_acces" ENABLE ROW LEVEL SECURITY;

-- Create demandes_acces table
CREATE TABLE IF NOT EXISTS "public"."demandes_acces" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" bigint NOT NULL,
    "pseudo" text NOT NULL,
    "presentation" text,
    "competence_principale" text,
    "niveau_competence" text,
    "niveau_rf" text,
    "source_decouverte" text,
    "attentes" text,
    "etat" text DEFAULT 'en_attente',
    "date_creation" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    "date_decision" timestamp with time zone,
    "raison_rejet" text,
    CONSTRAINT "unique_user_id" UNIQUE ("user_id")
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS "idx_demandes_acces_user_id" ON "public"."demandes_acces" ("user_id");

-- Create index on etat for filtering
CREATE INDEX IF NOT EXISTS "idx_demandes_acces_etat" ON "public"."demandes_acces" ("etat");

-- Create RLS policies
CREATE POLICY "Enable read access for service role" ON "public"."demandes_acces"
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert access for service role" ON "public"."demandes_acces"
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role" ON "public"."demandes_acces"
    FOR UPDATE USING (auth.role() = 'service_role');

-- Create enum types for standardized values
CREATE TYPE "public"."competence_type" AS ENUM (
    'RF',
    'Dev',
    'Scama',
    'Réseau',
    'Design',
    'Autre'
);

CREATE TYPE "public"."niveau_type" AS ENUM (
    'Débutant',
    'Intermédiaire',
    'Avancé',
    'Expert'
);

CREATE TYPE "public"."etat_type" AS ENUM (
    'en_attente',
    'approuvée',
    'rejetée'
);

-- Add constraints for enum types
ALTER TABLE "public"."demandes_acces" 
    ADD CONSTRAINT "competence_check" CHECK (competence_principale::competence_type IS NOT NULL),
    ADD CONSTRAINT "niveau_check" CHECK (niveau_competence::niveau_type IS NOT NULL),
    ADD CONSTRAINT "etat_check" CHECK (etat::etat_type IS NOT NULL);

-- Create function to automatically update date_decision
CREATE OR REPLACE FUNCTION "public"."update_date_decision"()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.etat != 'en_attente' AND OLD.etat = 'en_attente' THEN
        NEW.date_decision = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic date_decision update
CREATE TRIGGER "tr_update_date_decision"
    BEFORE UPDATE ON "public"."demandes_acces"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_date_decision"();
