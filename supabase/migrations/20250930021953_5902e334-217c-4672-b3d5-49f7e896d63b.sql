-- Remover políticas problemáticas
DROP POLICY IF EXISTS "Usuários podem ver sua própria clínica" ON public.clinicas;
DROP POLICY IF EXISTS "Apenas administradores podem gerenciar clínicas" ON public.clinicas;
DROP POLICY IF EXISTS "Administradores podem gerenciar perfis da sua clínica" ON public.profiles;

-- Permitir inserção pública de clínicas (apenas para criação inicial)
CREATE POLICY "Permitir criação de clínicas"
ON public.clinicas
FOR INSERT
TO public
WITH CHECK (true);

-- Permitir que usuários vejam sua própria clínica (sem recursão)
CREATE POLICY "Usuários podem ver sua própria clínica"
ON public.clinicas
FOR SELECT
TO authenticated
USING (id = (SELECT id_clinica FROM public.profiles WHERE id = auth.uid()));

-- Permitir que administradores atualizem sua clínica (sem recursão)
CREATE POLICY "Administradores podem atualizar clínica"
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

-- Permitir criação de perfis pelo trigger
CREATE POLICY "Permitir criação de perfis via signup"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (true);

-- Administradores podem inserir perfis na sua clínica
CREATE POLICY "Administradores podem criar perfis"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id_clinica = (
    SELECT id_clinica 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND tipo_perfil = 'administrador'
  )
  OR id = auth.uid()
);

-- Administradores podem atualizar perfis da sua clínica
CREATE POLICY "Administradores podem atualizar perfis"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  OR (
    id_clinica = (
      SELECT id_clinica 
      FROM public.profiles p2
      WHERE p2.id = auth.uid() 
      AND p2.tipo_perfil = 'administrador'
    )
  )
);