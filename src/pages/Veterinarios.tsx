import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Mail, Stethoscope } from "lucide-react";
import { useVeterinarios, useCreateVeterinario, useUpdateVeterinario, type Veterinario } from "@/hooks/useVeterinarios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Veterinarios() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVeterinario, setEditingVeterinario] = useState<Veterinario | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    especialidade: "",
    email: "",
    ativo: true,
  });

  const { data: veterinarios = [], isLoading } = useVeterinarios();
  const createVeterinario = useCreateVeterinario();
  const updateVeterinario = useUpdateVeterinario();

  const filteredVeterinarios = veterinarios.filter(vet =>
    vet.nome.toLowerCase().includes(search.toLowerCase()) ||
    vet.especialidade.toLowerCase().includes(search.toLowerCase()) ||
    vet.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVeterinario) {
      await updateVeterinario.mutateAsync({
        id: editingVeterinario.id,
        ...formData,
      });
    } else {
      await createVeterinario.mutateAsync(formData);
    }
    
    handleCloseDialog();
  };

  const handleEdit = (veterinario: Veterinario) => {
    setEditingVeterinario(veterinario);
    setFormData({
      nome: veterinario.nome,
      especialidade: veterinario.especialidade,
      email: veterinario.email,
      ativo: veterinario.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVeterinario(null);
    setFormData({
      nome: "",
      especialidade: "",
      email: "",
      ativo: true,
    });
  };

  const toggleStatus = async (veterinario: Veterinario) => {
    await updateVeterinario.mutateAsync({
      id: veterinario.id,
      ativo: !veterinario.ativo,
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
            <h1 className="text-3xl font-bold">Veterinários</h1>
            <p className="text-muted-foreground">
              Gerencie os veterinários da clínica
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Veterinário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVeterinario ? "Editar Veterinário" : "Novo Veterinário"}
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
                  <Label htmlFor="especialidade">Especialidade *</Label>
                  <Input
                    id="especialidade"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                    placeholder="Ex: Clínico Geral, Dermatologia, Cirurgia"
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
                  <Label htmlFor="ativo">Veterinário ativo</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createVeterinario.isPending || updateVeterinario.isPending}
                  >
                    {editingVeterinario ? "Atualizar" : "Cadastrar"}
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
                placeholder="Buscar por nome, especialidade ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Veterinários */}
        <div className="grid gap-4">
          {filteredVeterinarios.length > 0 ? (
            filteredVeterinarios.map((veterinario) => (
              <Card key={veterinario.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">Dr(a). {veterinario.nome}</h3>
                        <Badge variant={veterinario.ativo ? "default" : "secondary"}>
                          {veterinario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{veterinario.especialidade}</Badge>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {veterinario.email}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cadastrado em {format(new Date(veterinario.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(veterinario)}
                        disabled={updateVeterinario.isPending}
                      >
                        {veterinario.ativo ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(veterinario)}
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
                  {search ? "Nenhum veterinário encontrado" : "Nenhum veterinário cadastrado ainda"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}