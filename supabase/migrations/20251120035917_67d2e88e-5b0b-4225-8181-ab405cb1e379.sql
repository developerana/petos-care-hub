-- Remove políticas públicas inseguras
DROP POLICY IF EXISTS "Acesso público consultas" ON consultas;
DROP POLICY IF EXISTS "Tutores podem ver consultas de seus pets" ON consultas;

-- Política para staff da clínica visualizar todas as consultas
CREATE POLICY "Staff da clínica pode ver todas as consultas"
ON consultas
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tipo_perfil IN ('administrador', 'veterinario', 'recepcionista')
  )
);

-- Política para tutores verem apenas consultas de seus pets
CREATE POLICY "Tutores podem ver consultas de seus próprios pets"
ON consultas
FOR SELECT
TO authenticated
USING (
  id_pet IN (
    SELECT pets.id
    FROM pets
    INNER JOIN acessos_tutores ON pets.id_tutor = acessos_tutores.id_tutor
    WHERE acessos_tutores.user_id = auth.uid()
    AND acessos_tutores.ativo = true
  )
);

-- Política para veterinários criarem e atualizarem consultas
CREATE POLICY "Veterinários podem criar e atualizar consultas"
ON consultas
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tipo_perfil = 'veterinario'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tipo_perfil = 'veterinario'
  )
);

-- Política para recepcionistas criarem consultas
CREATE POLICY "Recepcionistas podem criar e atualizar consultas"
ON consultas
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tipo_perfil IN ('recepcionista', 'administrador')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tipo_perfil IN ('recepcionista', 'administrador')
  )
);