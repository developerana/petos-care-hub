import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca?: string;
  sexo?: string;
  data_nascimento: string;
  cor?: string;
  microchip?: string;
  data_cadastro: string;
}

interface DadosAnimalTabProps {
  pet: Pet;
}

export default function DadosAnimalTab({ pet }: DadosAnimalTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Completos do Animal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
            <p className="text-lg">{pet.nome}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Espécie</p>
            <p className="text-lg">{pet.especie}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Raça</p>
            <p className="text-lg">{pet.raca || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Sexo</p>
            <p className="text-lg">{pet.sexo || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
            <p className="text-lg">{format(new Date(pet.data_nascimento), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cor</p>
            <p className="text-lg">{pet.cor || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Microchip</p>
            <p className="text-lg font-mono">{pet.microchip || "Não cadastrado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
            <p className="text-lg">{format(new Date(pet.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}