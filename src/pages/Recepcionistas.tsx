import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Mail, UserCircle } from "lucide-react";
import { useRecepcionistas, useCreateRecepcionista, useUpdateRecepcionista, type Recepcionista } from "@/hooks/useRecepcionistas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Recepcionistas() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecepcionista, setEditingRecepcionista] = useState<Recepcionista | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    ativo: true,
  });

  const { data: recepcionistas = [], isLoading } = useRecepcionistas();
  const createRecepcionista = useCreateRecepcionista();
  const updateRecepcionista = useUpdateRecepcionista();

  const filteredRecepcionistas = recepcionistas.filter(rec =>
    rec.nome.toLowerCase().includes(search.toLowerCase()) ||
    rec.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRecepcionista) {
        await updateRecepcionista.mutateAsync({
          id: editingRecepcionista.id,
          ...formData,
        });
      } else {
        await createRecepcionista.mutateAsync(formData);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar recepcionista:", error);
    }
  };

  const handleEdit = (recepcionista: Recepcionista) => {
    setEditingRecepcionista(recepcionista);
    setFormData({
      nome: recepcionista.nome,
      email: recepcionista.email,
      ativo: recepcionista.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecepcionista(null);
    setFormData({
      nome: "",
      email: "",
      ativo: true,
    });
  };

  const toggleStatus = async (recepcionista: Recepcionista) => {
    await updateRecepcionista.mutateAsync({
      id: recepcionista.id,
      ativo: !recepcionista.ativo,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Recepcionistas</h1>
            <p className="text-muted-foreground">
              Gerencie os recepcionistas da clínica
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Recepcionista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRecepcionista ? "Editar Recepcionista" : "Novo Recepcionista"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                  />
                  <Label htmlFor="ativo">Recepcionista ativo</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createRecepcionista.isPending || updateRecepcionista.isPending}
                  >
                    {editingRecepcionista ? "Atualizar" : "Cadastrar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Recepcionistas */}
        <div className="grid gap-4">
          {filteredRecepcionistas.length > 0 ? (
            filteredRecepcionistas.map((recepcionista) => (
              <Card key={recepcionista.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold">{recepcionista.nome}</h3>
                        <Badge variant={recepcionista.ativo ? "default" : "secondary"}>
                          {recepcionista.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {recepcionista.email}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cadastrado em {format(new Date(recepcionista.data_criacao), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(recepcionista)}
                        disabled={updateRecepcionista.isPending}
                      >
                        {recepcionista.ativo ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(recepcionista)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {search ? "Nenhum recepcionista encontrado" : "Nenhum recepcionista cadastrado ainda"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
