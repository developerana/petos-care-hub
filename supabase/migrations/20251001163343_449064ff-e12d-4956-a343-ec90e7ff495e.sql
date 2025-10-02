-- Tabela para armazenar exames realizados
CREATE TABLE IF NOT EXISTS public.exames (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_pet UUID NOT NULL,
  id_consulta UUID,
  tipo_exame TEXT NOT NULL,
  data_realizacao DATE NOT NULL,
  resultado TEXT,
  arquivo_url TEXT,
  observacoes TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para planos de tratamento
CREATE TABLE IF NOT EXISTS public.tratamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_pet UUID NOT NULL,
  id_consulta UUID,
  diagnostico_atual TEXT NOT NULL,
  tratamento_prescrito TEXT NOT NULL,
  recomendacoes TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  status TEXT NOT NULL DEFAULT 'Em andamento',
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para controle financeiro
CREATE TABLE IF NOT EXISTS public.financeiro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_pet UUID NOT NULL,
  id_consulta UUID,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL DEFAULT 'Pendente',
  tipo TEXT NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para armazenar fotos dos animais
CREATE TABLE IF NOT EXISTS public.fotos_pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_pet UUID NOT NULL,
  url_foto TEXT NOT NULL,
  principal BOOLEAN NOT NULL DEFAULT false,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar coluna microchip e sexo na tabela pets se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'pets' AND column_name = 'microchip') THEN
    ALTER TABLE public.pets ADD COLUMN microchip TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'pets' AND column_name = 'sexo') THEN
    ALTER TABLE public.pets ADD COLUMN sexo TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'pets' AND column_name = 'cor') THEN
    ALTER TABLE public.pets ADD COLUMN cor TEXT;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tratamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_pets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acesso público (ajustar conforme necessidade)
CREATE POLICY "Acesso público exames" ON public.exames FOR ALL USING (true);
CREATE POLICY "Acesso público tratamentos" ON public.tratamentos FOR ALL USING (true);
CREATE POLICY "Acesso público financeiro" ON public.financeiro FOR ALL USING (true);
CREATE POLICY "Acesso público fotos_pets" ON public.fotos_pets FOR ALL USING (true);