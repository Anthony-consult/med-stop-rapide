-- Corriger les warnings de sécurité en ajoutant search_path aux fonctions
CREATE OR REPLACE FUNCTION public.generate_numero_dossier()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_numero text;
  exists_check boolean;
BEGIN
  LOOP
    new_numero := 'MED-' || 
                  to_char(now(), 'YYYYMMDD') || '-' ||
                  upper(substring(md5(random()::text) from 1 for 4));
    
    SELECT EXISTS(
      SELECT 1 FROM public.consultations WHERE numero_dossier = new_numero
    ) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_numero;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_numero_dossier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.numero_dossier IS NULL THEN
    NEW.numero_dossier := public.generate_numero_dossier();
  END IF;
  RETURN NEW;
END;
$$;