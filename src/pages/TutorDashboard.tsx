import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  Bell, 
  Plus, 
  Search,
  Syringe,
  FileText,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Layout";
import PetCard from "@/components/PetCard";

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for tutor's pets
  const myPets = [
    { 
      id: 1, 
      name: "Logan", 
      breed: "Labrador", 
      age: "3 anos", 
      weight: "30kg", 
      nextAppointment: "25 Jan, 2024",
      lastVisit: "15 Dez, 2023",
      vaccineStatus: "up-to-date" as const
    },
    { 
      id: 2, 
      name: "Marley", 
      breed: "Golden Retriever", 
      age: "5 anos", 
      weight: "28kg", 
      nextAppointment: "28 Jan, 2024",
      lastVisit: "10 Jan, 2024",
      vaccineStatus: "upcoming" as const
    },
    { 
      id: 3, 
      name: "Nolla", 
      breed: "Border Collie", 
      age: "2 anos", 
      weight: "20kg", 
      lastVisit: "05 Jan, 2024",
      vaccineStatus: "overdue" as const
    },
    { 
      id: 4, 
      name: "Pé Grande", 
      breed: "São Bernardo", 
      age: "4 anos", 
      weight: "45kg", 
      nextAppointment: "02 Fev, 2024",
      lastVisit: "20 Dez, 2023",
      vaccineStatus: "up-to-date" as const
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      petName: "Logan",
      date: "25 Jan, 2024",
      time: "14:00",
      vet: "Dr. Maria Silva",
      type: "Consulta de rotina"
    },
    {
      id: 2,
      petName: "Marley",
      date: "28 Jan, 2024", 
      time: "10:30",
      vet: "Dr. João Santos",
      type: "Vacinação"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "vaccine",
      message: "Vacina do Nolla está atrasada",
      date: "2 dias atrás",
      urgent: true
    },
    {
      id: 2,
      type: "appointment",
      message: "Consulta do Logan amanhã às 14:00",
      date: "1 dia",
      urgent: false
    }
  ];

  const handleViewPetDetails = (petId: number) => {
    console.log("View pet details:", petId);
  };

  const handleScheduleAppointment = (petId: number) => {
    console.log("Schedule appointment for pet:", petId);
  };

  const filteredPets = myPets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <div />
      </Sidebar>
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Pets</h1>
            <p className="text-muted-foreground">
              Acompanhe os dados e o histórico de saúde dos seus animais
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="gradient-primary" onClick={() => navigate('/appointments')}>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Consulta
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total de Pets
                  </p>
                  <p className="text-3xl font-bold">{myPets.length}</p>
                </div>
                <div className="p-3 rounded-full bg-accent">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Próximas Consultas
                  </p>
                  <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
                </div>
                <div className="p-3 rounded-full bg-accent">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Notificações
                  </p>
                  <p className="text-3xl font-bold">{notifications.length}</p>
                </div>
                <div className="p-3 rounded-full bg-accent">
                  <Bell className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pets Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Meus Pets ({filteredPets.length})</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onViewDetails={handleViewPetDetails}
                  onScheduleAppointment={handleScheduleAppointment}
                />
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Próximas Consultas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{appointment.petName}</h4>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} às {appointment.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.vet}
                    </p>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma consulta agendada
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notificações
                  </div>
                  {notifications.some(n => n.urgent) && (
                    <Badge variant="destructive">Urgente</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${
                    notification.urgent ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}>
                    <div className="flex items-start space-x-2">
                      <div className="mt-1">
                        {notification.type === 'vaccine' ? (
                          <Syringe className="h-4 w-4 text-primary" />
                        ) : (
                          <Calendar className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;