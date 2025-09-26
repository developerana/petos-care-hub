import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Heart, Calendar, FileText } from "lucide-react";
import { usePets, useCreatePet, useUpdatePet, type Pet } from "@/hooks/usePets";
import { useTutores } from "@/hooks/useTutores";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function Pets() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    data_nascimento: "",
    id_tutor: "",
  });

  const { data: pets = [], isLoading } = usePets();
  const { data: tutores = [] } = useTutores();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();

  const filteredPets = pets.filter(pet =>
    pet.nome.toLowerCase().includes(search.toLowerCase()) ||
    pet.especie.toLowerCase().includes(search.toLowerCase()) ||
    pet.tutor?.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPet) {
      await updatePet.mutateAsync({
        id: editingPet.id,
        ...formData,
      });
    } else {
      await createPet.mutateAsync(formData);
    }
    
    handleCloseDialog();
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca || "",
      data_nascimento: pet.data_nascimento,
      id_tutor: pet.id_tutor,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPet(null);
    setFormData({
      nome: "",
      especie: "",
      raca: "",
      data_nascimento: "",
      id_tutor: "",
    });
  };

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const diffTime = Math.abs(hoje.getTime() - nascimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} meses`;
    } else {
      return `${Math.floor(diffDays / 365)} anos`;
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
            <h1 className="text-3xl font-bold">Pets</h1>
            <p className="text-muted-foreground">
              Gerencie os pets cadastrados
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPet ? "Editar Pet" : "Novo Pet"}
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
                  <Label htmlFor="especie">Espécie *</Label>
                  <Select value={formData.especie} onValueChange={(value) => setFormData({...formData, especie: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espécie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cão">Cão</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                      <SelectItem value="Ave">Ave</SelectItem>
                      <SelectItem value="Roedor">Roedor</SelectItem>
                      <SelectItem value="Réptil">Réptil</SelectItem>
                      <SelectItem value="Peixe">Peixe</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="raca">Raça</Label>
                  <Input
                    id="raca"
                    value={formData.raca}
                    onChange={(e) => setFormData({...formData, raca: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="id_tutor">Tutor *</Label>
                  <Select value={formData.id_tutor} onValueChange={(value) => setFormData({...formData, id_tutor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutores.map((tutor) => (
                        <SelectItem key={tutor.id} value={tutor.id}>
                          {tutor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createPet.isPending || updatePet.isPending}
                  >
                    {editingPet ? "Atualizar" : "Cadastrar"}
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
                placeholder="Buscar por nome do pet, espécie ou tutor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pets */}
        <div className="grid gap-4">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <Card key={pet.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold">{pet.nome}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{pet.especie}</Badge>
                        {pet.raca && <Badge variant="outline">{pet.raca}</Badge>}
                        <span>{calcularIdade(pet.data_nascimento)}</span>
                      </div>
                      <p className="text-sm">
                        <strong>Tutor:</strong> {pet.tutor?.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cadastrado em {format(new Date(pet.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pet)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Link to={`/prontuario/${pet.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {search ? "Nenhum pet encontrado" : "Nenhum pet cadastrado ainda"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}