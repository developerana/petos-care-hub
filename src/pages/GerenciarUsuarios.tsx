import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit, Trash2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GerenciarUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder - dados virão do Supabase
  const usuarios = [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Administre os usuários da sua clínica</p>
          </div>
          <Link to="/admin/usuarios/novo">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {usuarios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Comece criando um novo usuário
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Lista de usuários virá aqui */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}