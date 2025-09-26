-- Criar tabela de tutores
CREATE TABLE public.tutores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pets
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  raca TEXT,
  data_nascimento DATE NOT NULL,
  id_tutor UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de veterinários
CREATE TABLE public.veterinarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  email TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de consultas
CREATE TABLE public.consultas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_consulta DATE NOT NULL,
  hora_consulta TIME NOT NULL,
  id_pet UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  id_veterinario UUID NOT NULL REFERENCES public.veterinarios(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Agendada' CHECK (status IN ('Agendada', 'Realizada', 'Cancelada')),
  anamnese TEXT,
  diagnostico TEXT,
  tratamento TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de vacinas
CREATE TABLE public.vacinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_pet UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  nome_vacina TEXT NOT NULL,
  data_aplicacao DATE NOT NULL,
  proxima_dose DATE,
  observacoes TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veterinarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacinas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (acesso público para o MVP com usuário único)
CREATE POLICY "Acesso público tutores" ON public.tutores FOR ALL USING (true);
CREATE POLICY "Acesso público pets" ON public.pets FOR ALL USING (true);
CREATE POLICY "Acesso público veterinarios" ON public.veterinarios FOR ALL USING (true);
CREATE POLICY "Acesso público consultas" ON public.consultas FOR ALL USING (true);
CREATE POLICY "Acesso público vacinas" ON public.vacinas FOR ALL USING (true);

-- Criar índices para melhor performance
CREATE INDEX idx_pets_tutor ON public.pets(id_tutor);
CREATE INDEX idx_consultas_pet ON public.consultas(id_pet);
CREATE INDEX idx_consultas_veterinario ON public.consultas(id_veterinario);
CREATE INDEX idx_consultas_data ON public.consultas(data_consulta);
CREATE INDEX idx_vacinas_pet ON public.vacinas(id_pet);
CREATE INDEX idx_vacinas_proxima_dose ON public.vacinas(proxima_dose);

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;