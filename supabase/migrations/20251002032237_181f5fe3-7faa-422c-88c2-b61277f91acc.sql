-- Adicionar campos faltantes na tabela tutores
ALTER TABLE public.tutores 
ADD COLUMN IF NOT EXISTS cpf TEXT,
ADD COLUMN IF NOT EXISTS rg TEXT,
ADD COLUMN IF NOT EXISTS endereco TEXT;

-- Adicionar campo peso na tabela pets
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS peso NUMERIC;

-- Criar tabela de prescrições se não existir
CREATE TABLE IF NOT EXISTS public.prescricoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_pet UUID NOT NULL,
  id_consulta UUID,
  medicamento TEXT NOT NULL,
  posologia TEXT NOT NULL,
  data_prescricao DATE NOT NULL,
  id_veterinario UUID,
  observacoes TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prescricoes ENABLE ROW LEVEL SECURITY;

-- Create policy for prescricoes
CREATE POLICY "Acesso público prescrições" 
ON public.prescricoes 
FOR ALL 
USING (true);

-- Adicionar campo veterinario na tabela vacinas se não existir
ALTER TABLE public.vacinas
ADD COLUMN IF NOT EXISTS id_veterinario UUID;

-- Adicionar campo id_veterinario na tabela tratamentos se não existir
ALTER TABLE public.tratamentos
ADD COLUMN IF NOT EXISTS id_veterinario UUID;

-- Adicionar campo medicacoes na tabela tratamentos (JSON array)
ALTER TABLE public.tratamentos
ADD COLUMN IF NOT EXISTS medicacoes JSONB DEFAULT '[]'::jsonb;