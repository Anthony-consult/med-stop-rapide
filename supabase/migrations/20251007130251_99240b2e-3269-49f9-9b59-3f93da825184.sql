-- Table pour les leads (formulaire contact)
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  message text,
  consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Table pour les consultations (formulaire principal)
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  
  -- Identité patient
  nom_prenom text NOT NULL,
  date_naissance date NOT NULL,
  email text NOT NULL,
  
  -- Questionnaire médical
  maladie_presumee text,
  symptomes text[],
  diagnostic_anterieur text,
  autres_symptomes text,
  zones_douleur text[],
  apparition_soudaine text,
  medicaments_reguliers text,
  facteurs_risque boolean DEFAULT false,
  
  -- Type d'arrêt
  type_arret text,
  profession text,
  
  -- Dates incapacité
  date_debut date,
  date_fin date,
  date_fin_lettres text,
  
  -- Adresse
  adresse text,
  code_postal text,
  ville text,
  pays text DEFAULT 'France',
  
  -- Informations professionnelles
  situation_pro text,
  localisation_medecin text,
  
  -- Sécurité sociale
  numero_securite_sociale text,
  
  -- Acceptation conditions
  conditions_acceptees boolean DEFAULT false,
  
  -- Paiement Stripe
  payment_status text DEFAULT 'pending',
  payment_id text,
  confirmation_sent boolean DEFAULT false,
  
  -- Numéro de dossier (généré automatiquement)
  numero_dossier text UNIQUE
);

-- Index pour recherche rapide
CREATE INDEX idx_consultations_email ON public.consultations(email);
CREATE INDEX idx_consultations_payment_status ON public.consultations(payment_status);
CREATE INDEX idx_leads_email ON public.leads(email);

-- Fonction pour générer un numéro de dossier unique
CREATE OR REPLACE FUNCTION public.generate_numero_dossier()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_numero text;
  exists_check boolean;
BEGIN
  LOOP
    -- Format: MED-YYYYMMDD-XXXX (ex: MED-20250107-A3F9)
    new_numero := 'MED-' || 
                  to_char(now(), 'YYYYMMDD') || '-' ||
                  upper(substring(md5(random()::text) from 1 for 4));
    
    -- Vérifier si le numéro existe déjà
    SELECT EXISTS(
      SELECT 1 FROM public.consultations WHERE numero_dossier = new_numero
    ) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_numero;
END;
$$;

-- Trigger pour générer automatiquement le numéro de dossier
CREATE OR REPLACE FUNCTION public.set_numero_dossier()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.numero_dossier IS NULL THEN
    NEW.numero_dossier := public.generate_numero_dossier();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_numero_dossier
  BEFORE INSERT ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_numero_dossier();

-- RLS: Pas d'authentification, mais on protège quand même
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Politique: Autoriser les insertions anonymes (formulaires publics)
CREATE POLICY "Allow anonymous inserts on leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on consultations"
  ON public.consultations
  FOR INSERT
  WITH CHECK (true);

-- Politique: Lecture réservée aux admins (via service role key uniquement)
CREATE POLICY "Service role can read all leads"
  ON public.leads
  FOR SELECT
  USING (false);

CREATE POLICY "Service role can read all consultations"
  ON public.consultations
  FOR SELECT
  USING (false);