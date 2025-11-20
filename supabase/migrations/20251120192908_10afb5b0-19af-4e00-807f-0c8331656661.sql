-- Adicionar coluna arquivado na tabela pets
ALTER TABLE pets ADD COLUMN IF NOT EXISTS arquivado BOOLEAN DEFAULT false;

-- Adicionar coluna data_falecimento para registrar quando o pet faleceu
ALTER TABLE pets ADD COLUMN IF NOT EXISTS data_falecimento DATE;

-- Criar índice para melhorar performance nas consultas de pets arquivados
CREATE INDEX IF NOT EXISTS idx_pets_arquivado ON pets(arquivado);