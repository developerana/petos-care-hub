import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pet, useUpdatePet } from "@/hooks/usePets";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Save, X } from "lucide-react";

interface DadosAnimalTabProps {
  pet: Pet;
}

export default function DadosAnimalTab({ pet }: DadosAnimalTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: pet.nome,
    especie: pet.especie,
    raca: pet.raca || "",
    sexo: pet.sexo || "",
    data_nascimento: pet.data_nascimento,
    cor: pet.cor || "",
    microchip: pet.microchip || "",
    peso: pet.peso?.toString() || "",
  });

  const updatePet = useUpdatePet();

  const handleSave = async () => {
    await updatePet.mutateAsync({
      id: pet.id,
      ...formData,
      peso: formData.peso ? parseFloat(formData.peso) : null,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="especie">Espécie</Label>
          <Select
            value={formData.especie}
            onValueChange={(value) => setFormData({ ...formData, especie: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue />
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
            onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="sexo">Sexo</Label>
          <Select
            value={formData.sexo}
            onValueChange={(value) => setFormData({ ...formData, sexo: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Fêmea">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="data_nascimento">Data de Nascimento</Label>
          <Input
            id="data_nascimento"
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="cor">Cor</Label>
          <Input
            id="cor"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="microchip">Microchip</Label>
          <Input
            id="microchip"
            value={formData.microchip}
            onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            step="0.1"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="pt-4 border-t text-sm text-muted-foreground text-right">
        Última atualização: {format(new Date(), "dd/MM/yyyy, HH:mm", { locale: ptBR })}
      </div>
    </div>
  );
}
