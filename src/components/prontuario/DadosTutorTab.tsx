import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTutor } from "@/hooks/useTutores";
import { usePetsByTutor } from "@/hooks/usePets";
import { Badge } from "@/components/ui/badge";

interface DadosTutorTabProps {
  tutorId: string;
}

export default function DadosTutorTab({ tutorId }: DadosTutorTabProps) {
  const { data: tutor, isLoading: tutorLoading } = useTutor(tutorId);
  const { data: outrosPets = [], isLoading: petsLoading } = usePetsByTutor(tutorId);

  if (tutorLoading || petsLoading) {
    return <p>Carregando dados do tutor...</p>;
  }

  if (!tutor) {
    return <p>Tutor não encontrado</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Tutor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
            <p className="text-lg">{tutor.nome}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">E-mail</p>
            <p className="text-lg">{tutor.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
            <p className="text-lg">{tutor.telefone}</p>
          </div>
        </div>

        {outrosPets.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Outros animais do tutor</h3>
            <div className="flex flex-wrap gap-2">
              {outrosPets.map((pet) => (
                <Badge key={pet.id} variant="secondary">
                  {pet.nome} ({pet.especie})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}