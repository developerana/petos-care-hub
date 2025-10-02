import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pet } from "@/hooks/usePets";
import { useTutor } from "@/hooks/useTutores";
import { usePetsByTutor } from "@/hooks/usePets";
import { User, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DadosTutorTabProps {
  pet: Pet;
}

export default function DadosTutorTab({ pet }: DadosTutorTabProps) {
  const { data: tutor } = useTutor(pet.id_tutor);
  const { data: outrosPets = [] } = usePetsByTutor(pet.id_tutor);

  if (!tutor) {
    return <div>Carregando dados do tutor...</div>;
  }

  const outrosAnimais = outrosPets.filter(p => p.id !== pet.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <Label>Nome Completo</Label>
              </div>
              <p className="font-medium">{tutor.nome}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <Label>Telefone</Label>
              </div>
              <p className="font-medium">{tutor.telefone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <Label>E-mail</Label>
              </div>
              <p className="font-medium">{tutor.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <Label>CPF</Label>
              </div>
              <p className="font-medium">{tutor.cpf || "Não informado"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <Label>RG</Label>
              </div>
              <p className="font-medium">{tutor.rg || "Não informado"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <Label>Endereço</Label>
              </div>
              <p className="font-medium">{tutor.endereco || "Não informado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {outrosAnimais.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Outros Animais do Tutor</h3>
          <div className="grid gap-3">
            {outrosAnimais.map((animal) => (
              <Card key={animal.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{animal.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {animal.especie} {animal.raca && `• ${animal.raca}`}
                      </p>
                    </div>
                    <Link to={`/prontuario/${animal.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Prontuário
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
