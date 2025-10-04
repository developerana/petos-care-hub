import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Syringe, FileText } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  weight: string;
  tutor?: string;
  nextAppointment?: string;
  vaccineStatus: "up-to-date" | "overdue" | "upcoming";
  lastVisit?: string;
}

interface PetCardProps {
  pet: Pet;
  showTutor?: boolean;
  onViewDetails?: (petId: number) => void;
  onScheduleAppointment?: (petId: number) => void;
}

const PetCard = ({ 
  pet, 
  showTutor = false, 
  onViewDetails, 
  onScheduleAppointment 
}: PetCardProps) => {
  
  const getVaccineStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "default";
      case "overdue":
        return "destructive";
      case "upcoming":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getVaccineStatusText = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "Vacinas em dia";
      case "overdue":
        return "Vacinas atrasadas";
      case "upcoming":
        return "Vacinas próximas";
      default:
        return "Status desconhecido";
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-smooth overflow-hidden">
      <CardContent className="p-0">
        {/* Pet Avatar/Image Placeholder */}
        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Heart className="h-12 w-12 text-primary" />
        </div>
        
        {/* Pet Information */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-3">
                <span>Idade: {pet.age}</span>
                <span>Peso: {pet.weight}</span>
              </div>
            </div>
            <Badge variant={getVaccineStatusColor(pet.vaccineStatus)}>
              {getVaccineStatusText(pet.vaccineStatus)}
            </Badge>
          </div>

          {/* Additional Information */}
          <div className="space-y-2 mb-4">
            {showTutor && pet.tutor && (
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Tutor: {pet.tutor}</span>
              </div>
            )}
            
            {pet.nextAppointment && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Próxima consulta: {pet.nextAppointment}</span>
              </div>
            )}
            
            {pet.lastVisit && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-3 w-3 mr-1" />
                <span>Última visita: {pet.lastVisit}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails?.(pet.id)}
            >
              <FileText className="h-3 w-3 mr-1" />
              Detalhes
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onScheduleAppointment?.(pet.id)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;