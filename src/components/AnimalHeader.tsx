import { ArrowLeft, Edit, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface AnimalHeaderProps {
  animal: {
    name: string;
    species: string;
    breed: string;
    sex: string;
    age: string;
    tutor: string;
    tutorPhone?: string;
    tutorEmail?: string;
    tutorCpf?: string;
    tutorAddress?: string;
    microchip: string;
    color?: string;
    weight?: number;
    id: string;
    photo?: string;
  };
}

export const AnimalHeader = ({ animal }: AnimalHeaderProps) => {
  return (
    <Card className="p-6 shadow-card border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-6">
          <div className="relative">
            {animal.photo ? (
              <img
                src={animal.photo}
                alt={animal.name}
                className="w-32 h-32 rounded-xl object-cover border-2 border-border"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center border-2 border-border">
                <span className="text-4xl text-muted-foreground">🐾</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{animal.name}</h1>
              <p className="text-sm text-muted-foreground">ID: {animal.id}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Dados do Animal</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Espécie:</span>{" "}
                    <span className="font-medium text-foreground">{animal.species}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Raça:</span>{" "}
                    <span className="font-medium text-foreground">{animal.breed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sexo:</span>{" "}
                    <span className="font-medium text-foreground">{animal.sex}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Idade:</span>{" "}
                    <span className="font-medium text-foreground">{animal.age}</span>
                  </div>
                  {animal.color && (
                    <div>
                      <span className="text-muted-foreground">Cor:</span>{" "}
                      <span className="font-medium text-foreground">{animal.color}</span>
                    </div>
                  )}
                  {animal.weight && (
                    <div>
                      <span className="text-muted-foreground">Peso:</span>{" "}
                      <span className="font-medium text-foreground">{animal.weight} kg</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Microchip:</span>{" "}
                    <span className="font-medium text-foreground">{animal.microchip}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Dados do Tutor</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>{" "}
                    <span className="font-medium text-foreground">{animal.tutor}</span>
                  </div>
                  {animal.tutorPhone && (
                    <div>
                      <span className="text-muted-foreground">Telefone:</span>{" "}
                      <span className="font-medium text-foreground">{animal.tutorPhone}</span>
                    </div>
                  )}
                  {animal.tutorEmail && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium text-foreground">{animal.tutorEmail}</span>
                    </div>
                  )}
                  {animal.tutorCpf && (
                    <div>
                      <span className="text-muted-foreground">CPF:</span>{" "}
                      <span className="font-medium text-foreground">{animal.tutorCpf}</span>
                    </div>
                  )}
                  {animal.tutorAddress && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Endereço:</span>{" "}
                      <span className="font-medium text-foreground">{animal.tutorAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({
              title: "Editar dados",
              description: "Função de edição será implementada em breve.",
            })}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.jpg,.jpeg,.png';
              input.onchange = () => {
                toast({
                  title: "Arquivo anexado",
                  description: "O documento foi anexado com sucesso.",
                });
              };
              input.click();
            }}
          >
            <Paperclip className="w-4 h-4 mr-2" />
            Anexar
          </Button>
        </div>
      </div>
    </Card>
  );
};
