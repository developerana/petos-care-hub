-- Dropar todas as políticas existentes de clinicas para recomeçar
DROP POLICY IF EXISTS "Permitir criação de clínicas" ON public.clinicas;
DROP POLICY IF EXISTS "Usuários podem ver sua própria clínica" ON public.clinicas;
DROP POLICY IF EXISTS "Administradores podem atualizar clínica" ON public.clinicas;

-- Permitir que qualquer um (incluindo usuários não autenticados) crie uma clínica
CREATE POLICY "Qualquer um pode criar clínica"
ON public.clinicas
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir que usuários autenticados vejam sua própria clínica
CREATE POLICY "Ver própria clínica"
ON public.clinicas
FOR SELECT
TO authenticated
USING (
  id = (SELECT id_clinica FROM public.profiles WHERE id = auth.uid())
);

-- Permitir que administradores atualizem sua clínica
CREATE POLICY "Admin atualiza clínica"
ON public.clinicas
FOR UPDATE
TO authenticated
USING (
  id = (
    SELECT id_clinica 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND tipo_perfil = 'administrador'
  )
);

-- Permitir que administradores deletem (soft delete seria melhor)
CREATE POLICY "Admin deleta clínica"
ON public.clinicas
FOR DELETE
TO authenticated
USING (
  id = (
    SELECT id_clinica 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND tipo_perfil = 'administrador'
  )
);