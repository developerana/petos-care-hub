-- Criar tabela de clínicas
CREATE TABLE IF NOT EXISTS public.clinicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true
);

-- Adicionar coluna id_clinica nas tabelas existentes
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS id_clinica UUID REFERENCES public.clinicas(id);

ALTER TABLE public.veterinarios 
ADD COLUMN IF NOT EXISTS id_clinica UUID REFERENCES public.clinicas(id);

ALTER TABLE public.tutores 
ADD COLUMN IF NOT EXISTS id_clinica UUID REFERENCES public.clinicas(id);

-- Criar tabela de profiles para vincular auth.users com dados do usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo_perfil TEXT NOT NULL CHECK (tipo_perfil IN ('administrador', 'veterinario', 'recepcionista', 'tutor')),
  id_clinica UUID REFERENCES public.clinicas(id),
  id_referencia UUID, -- ID do registro na tabela específica (veterinarios, tutores, etc)
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies para clinicas
CREATE POLICY "Usuários podem ver sua própria clínica"
ON public.clinicas
FOR SELECT
USING (
  id IN (
    SELECT id_clinica FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Apenas administradores podem gerenciar clínicas"
ON public.clinicas
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND tipo_perfil = 'administrador'
    AND id_clinica = clinicas.id
  )
);

-- Policies para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles
FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Administradores podem gerenciar perfis da sua clínica"
ON public.profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin
    WHERE admin.id = auth.uid()
    AND admin.tipo_perfil = 'administrador'
    AND admin.id_clinica = profiles.id_clinica
  )
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, tipo_perfil, id_clinica, id_referencia)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tipo_perfil', 'tutor'),
    (NEW.raw_user_meta_data->>'id_clinica')::uuid,
    (NEW.raw_user_meta_data->>'id_referencia')::uuid
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();