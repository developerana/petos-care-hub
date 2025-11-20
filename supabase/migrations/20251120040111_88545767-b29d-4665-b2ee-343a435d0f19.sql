-- Adicionar políticas temporárias para desenvolvimento
-- ATENÇÃO: Estas políticas devem ser removidas quando o sistema de autenticação for implementado

-- Política temporária para permitir qualquer usuário criar consultas
CREATE POLICY "Permitir criação pública de consultas (temporário)"
ON consultas
FOR INSERT
TO anon
WITH CHECK (true);

-- Política temporária para permitir qualquer usuário atualizar consultas
CREATE POLICY "Permitir atualização pública de consultas (temporário)"
ON consultas
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Política temporária para permitir qualquer usuário visualizar consultas
CREATE POLICY "Permitir visualização pública de consultas (temporário)"
ON consultas
FOR SELECT
TO anon
USING (true);