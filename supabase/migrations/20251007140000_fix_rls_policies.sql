-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow anonymous inserts on consultations" ON public.consultations;
DROP POLICY IF EXISTS "Service role can read all consultations" ON public.consultations;
DROP POLICY IF EXISTS "Service role can update consultations" ON public.consultations;

-- Recréer les politiques correctement
-- 1. Permettre les insertions pour tout le monde (anon et authenticated)
CREATE POLICY "Enable insert for anonymous users"
  ON public.consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Permettre la lecture avec service_role uniquement
CREATE POLICY "Enable read for service role only"
  ON public.consultations
  FOR SELECT
  TO service_role
  USING (true);

-- 3. Permettre la mise à jour avec service_role uniquement
CREATE POLICY "Enable update for service role only"
  ON public.consultations
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Permettre la suppression avec service_role uniquement
CREATE POLICY "Enable delete for service role only"
  ON public.consultations
  FOR DELETE
  TO service_role
  USING (true);

