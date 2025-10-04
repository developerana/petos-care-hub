import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const DadosTab = () => {
  return (
    <Card className="p-6 shadow-card animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Informações do Animal</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" defaultValue="Rex" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="especie">Espécie</Label>
          <Input id="especie" defaultValue="Canino" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="raca">Raça</Label>
          <Input id="raca" defaultValue="Golden Retriever" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo</Label>
          <Input id="sexo" defaultValue="Macho" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nascimento">Data de Nascimento</Label>
          <Input id="nascimento" type="date" defaultValue="2020-03-15" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" defaultValue="Dourado" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="microchip">Microchip</Label>
          <Input id="microchip" defaultValue="987654321" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input id="peso" type="number" defaultValue="32" />
        </div>
      </div>
    </Card>
  );
};
