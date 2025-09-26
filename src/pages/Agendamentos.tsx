import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Calendar, Clock, Heart } from "lucide-react";
import { useConsultas, useCreateConsulta, useUpdateConsulta, type Consulta } from "@/hooks/useConsultas";
import { usePets } from "@/hooks/usePets";
import { useVeterinariosAtivos } from "@/hooks/useVeterinarios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Agendamentos() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);
  const [formData, setFormData] = useState({
    data_consulta: "",
    hora_consulta: "",
    id_pet: "",
    id_veterinario: "",
    status: "Agendada" as "Agendada" | "Realizada" | "Cancelada",
  });

  const { data: consultas = [], isLoading } = useConsultas();
  const { data: pets = [] } = usePets();
  const { data: veterinarios = [] } = useVeterinariosAtivos();
  const createConsulta = useCreateConsulta();
  const updateConsulta = useUpdateConsulta();

  const filteredConsultas = consultas.filter(consulta =>
    consulta.pet?.nome.toLowerCase().includes(search.toLowerCase()) ||
    consulta.pet?.tutor?.nome.toLowerCase().includes(search.toLowerCase()) ||
    consulta.veterinario?.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingConsulta) {
      await updateConsulta.mutateAsync({
        id: editingConsulta.id,
        ...formData,
      });
    } else {
      await createConsulta.mutateAsync(formData);
    }
    
    handleCloseDialog();
  };

  const handleEdit = (consulta: Consulta) => {
    setEditingConsulta(consulta);
    setFormData({
      data_consulta: consulta.data_consulta,
      hora_consulta: consulta.hora_consulta,
      id_pet: consulta.id_pet,
      id_veterinario: consulta.id_veterinario,
      status: consulta.status,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingConsulta(null);
    setFormData({
      data_consulta: "",
      hora_consulta: "",
      id_pet: "",
      id_veterinario: "",
      status: "Agendada",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "default";
      case "Realizada":
        return "default";
      case "Cancelada":
        return "destructive";
      default:
        return "secondary";
    }
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
            <h1 className="text-3xl font-bold">Agendamentos</h1>
            <p className="text-muted-foreground">
              Gerencie as consultas e agendamentos
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Consulta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingConsulta ? "Editar Consulta" : "Nova Consulta"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="id_pet">Pet *</Label>
                  <Select value={formData.id_pet} onValueChange={(value) => setFormData({...formData, id_pet: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.nome} - {pet.tutor?.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="id_veterinario">Veterinário *</Label>
                  <Select value={formData.id_veterinario} onValueChange={(value) => setFormData({...formData, id_veterinario: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veterinário" />
                    </SelectTrigger>
                    <SelectContent>
                      {veterinarios.map((vet) => (
                        <SelectItem key={vet.id} value={vet.id}>
                          Dr(a). {vet.nome} - {vet.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data_consulta">Data *</Label>
                  <Input
                    id="data_consulta"
                    type="date"
                    value={formData.data_consulta}
                    onChange={(e) => setFormData({...formData, data_consulta: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_consulta">Horário *</Label>
                  <Input
                    id="hora_consulta"
                    type="time"
                    value={formData.hora_consulta}
                    onChange={(e) => setFormData({...formData, hora_consulta: e.target.value})}
                    required
                  />
                </div>
                {editingConsulta && (
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agendada">Agendada</SelectItem>
                        <SelectItem value="Realizada">Realizada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createConsulta.isPending || updateConsulta.isPending}
                  >
                    {editingConsulta ? "Atualizar" : "Agendar"}
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
                placeholder="Buscar por pet, tutor ou veterinário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Consultas */}
        <div className="grid gap-4">
          {filteredConsultas.length > 0 ? (
            filteredConsultas.map((consulta) => (
              <Card key={consulta.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold">{consulta.pet?.nome}</h3>
                        <Badge variant={getStatusColor(consulta.status)}>
                          {consulta.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Tutor:</strong> {consulta.pet?.tutor?.nome}</p>
                        <p><strong>Veterinário:</strong> Dr(a). {consulta.veterinario?.nome} - {consulta.veterinario?.especialidade}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(consulta.data_consulta), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {consulta.hora_consulta}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(consulta)}
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
                  {search ? "Nenhuma consulta encontrada" : "Nenhuma consulta agendada ainda"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}