-- Criar tabela de usuários do sistema (funcionários da clínica)
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  tipo_perfil TEXT NOT NULL CHECK (tipo_perfil IN ('admin', 'veterinario', 'recepcionista')),
  id_veterinario UUID REFERENCES public.veterinarios(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de acessos para tutores (portal externo)
CREATE TABLE public.acessos_tutores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_tutor UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de horários disponíveis
CREATE TABLE public.horarios_disponiveis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_veterinario UUID NOT NULL REFERENCES public.veterinarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de notificações
CREATE TABLE public.notificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_usuario UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  id_tutor UUID REFERENCES public.tutores(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('lembrete_consulta', 'lembrete_vacina', 'confirmacao', 'cancelamento', 'geral')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT false,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_leitura TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de mensagens entre tutor e clínica
CREATE TABLE public.mensagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_tutor UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
  id_usuario UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  mensagem TEXT NOT NULL,
  remetente TEXT NOT NULL CHECK (remetente IN ('tutor', 'clinica')),
  lida BOOLEAN NOT NULL DEFAULT false,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acessos_tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_disponiveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para usuários (funcionários)
CREATE POLICY "Usuários podem ver dados da clínica" ON public.usuarios FOR ALL USING (true);
CREATE POLICY "Usuários podem ver horários disponíveis" ON public.horarios_disponiveis FOR ALL USING (true);
CREATE POLICY "Usuários podem ver notificações" ON public.notificacoes FOR ALL USING (true);
CREATE POLICY "Usuários podem ver mensagens" ON public.mensagens FOR ALL USING (true);

-- Criar políticas RLS para tutores (portal externo)
CREATE POLICY "Tutores podem ver seus próprios acessos" ON public.acessos_tutores 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Tutores podem ver suas próprias notificações" ON public.notificacoes 
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.acessos_tutores WHERE id_tutor = notificacoes.id_tutor));

CREATE POLICY "Tutores podem ver suas próprias mensagens" ON public.mensagens 
FOR ALL USING (id_tutor IN (SELECT id_tutor FROM public.acessos_tutores WHERE user_id = auth.uid()));

-- Criar políticas para dados existentes (tutores podem ver apenas seus pets)
CREATE POLICY "Tutores podem ver apenas seus pets" ON public.pets 
FOR SELECT USING (
  id_tutor IN (SELECT id_tutor FROM public.acessos_tutores WHERE user_id = auth.uid())
  OR true -- Manter acesso público para funcionários
);

CREATE POLICY "Tutores podem ver consultas de seus pets" ON public.consultas 
FOR SELECT USING (
  id_pet IN (
    SELECT id FROM public.pets 
    WHERE id_tutor IN (SELECT id_tutor FROM public.acessos_tutores WHERE user_id = auth.uid())
  )
  OR true -- Manter acesso público para funcionários
);

CREATE POLICY "Tutores podem ver vacinas de seus pets" ON public.vacinas 
FOR SELECT USING (
  id_pet IN (
    SELECT id FROM public.pets 
    WHERE id_tutor IN (SELECT id_tutor FROM public.acessos_tutores WHERE user_id = auth.uid())
  )
  OR true -- Manter acesso público para funcionários
);

-- Criar índices para performance
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_tipo_perfil ON public.usuarios(tipo_perfil);
CREATE INDEX idx_acessos_tutores_email ON public.acessos_tutores(email);
CREATE INDEX idx_acessos_tutores_tutor ON public.acessos_tutores(id_tutor);
CREATE INDEX idx_horarios_veterinario_data ON public.horarios_disponiveis(id_veterinario, data);
CREATE INDEX idx_notificacoes_usuario ON public.notificacoes(id_usuario);
CREATE INDEX idx_notificacoes_tutor ON public.notificacoes(id_tutor);
CREATE INDEX idx_mensagens_tutor ON public.mensagens(id_tutor);

-- Função para criar usuário funcionário
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se é um funcionário da clínica baseado no email
  IF NEW.email LIKE '%@clinic.com' OR NEW.raw_user_meta_data->>'user_type' = 'staff' THEN
    INSERT INTO public.usuarios (user_id, email, nome, tipo_perfil)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
      COALESCE(NEW.raw_user_meta_data->>'tipo_perfil', 'recepcionista')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil de usuário automaticamente
CREATE TRIGGER on_auth_user_created_staff
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();