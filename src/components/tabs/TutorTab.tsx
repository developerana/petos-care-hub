import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const TutorTab = () => {
  return (
    <Card className="p-6 shadow-card animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Dados do Tutor</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="nome-tutor">Nome Completo</Label>
          <Input id="nome-tutor" defaultValue="Maria Silva" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" defaultValue="123.456.789-00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input id="rg" defaultValue="12.345.678-9" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" defaultValue="(11) 98765-4321" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" defaultValue="maria.silva@email.com" />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" defaultValue="Rua das Flores, 123 - Centro - São Paulo/SP" />
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Outros Animais do Tutor</h3>
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-foreground">Bella - Felino - Persa</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-foreground">Thor - Canino - Labrador</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
