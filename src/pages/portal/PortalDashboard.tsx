import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Calendar, 
  Syringe, 
  MessageCircle, 
  Bell,
  PlusCircle,
  Eye,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  data_nascimento: string;
}

interface Consulta {
  id: string;
  data_consulta: string;
  hora_consulta: string;
  status: string;
  pets: { nome: string };
  veterinarios: { nome: string };
}

interface Vacina {
  id: string;
  nome_vacina: string;
  data_aplicacao: string;
  proxima_dose: string | null;
  pets: { nome: string };
}

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  data_envio: string;
}

export default function PortalDashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [tutorData, setTutorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/portal');
        return;
      }

      // Buscar dados do tutor
      const { data: acessoTutor } = await supabase
        .from('acessos_tutores')
        .select(`
          id_tutor,
          tutores (
            id,
            nome,
            email,
            telefone
          )
        `)
        .eq('user_id', session.user.id)
        .single();

      if (!acessoTutor) {
        toast({
          title: "Erro",
          description: "Dados do tutor não encontrados.",
          variant: "destructive",
        });
        return;
      }

      setTutorData(acessoTutor.tutores);

      // Buscar pets do tutor
      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('id_tutor', acessoTutor.id_tutor)
        .order('nome');

      setPets(petsData || []);

      // Buscar consultas recentes
      const { data: consultasData } = await supabase
        .from('consultas')
        .select(`
          *,
          pets!inner (nome),
          veterinarios (nome)
        `)
        .eq('pets.id_tutor', acessoTutor.id_tutor)
        .order('data_consulta', { ascending: false })
        .limit(5);

      setConsultas(consultasData || []);

      // Buscar vacinas próximas do vencimento
      const { data: vacinasData } = await supabase
        .from('vacinas')
        .select(`
          *,
          pets!inner (nome)
        `)
        .eq('pets.id_tutor', acessoTutor.id_tutor)
        .not('proxima_dose', 'is', null)
        .gte('proxima_dose', new Date().toISOString().split('T')[0])
        .order('proxima_dose')
        .limit(5);

      setVacinas(vacinasData || []);

      // Buscar notificações não lidas
      const { data: notificacoesData } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('id_tutor', acessoTutor.id_tutor)
        .eq('lida', false)
        .order('data_envio', { ascending: false })
        .limit(5);

      setNotificacoes(notificacoesData || []);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/portal');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendada':
        return 'success';
      case 'confirmada':
        return 'default';
      case 'cancelada':
        return 'destructive';
      case 'realizada':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Portal do Tutor</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {tutorData?.nome}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Pets</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                pets cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultas.length}</div>
              <p className="text-xs text-muted-foreground">
                consultas recentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacinas</CardTitle>
              <Syringe className="h-4 w-4 text-nature" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vacinas.length}</div>
              <p className="text-xs text-muted-foreground">
                próximas doses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificações</CardTitle>
              <Bell className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificacoes.length}</div>
              <p className="text-xs text-muted-foreground">
                não lidas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meus Pets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meus Pets</CardTitle>
                  <CardDescription>
                    Pets cadastrados em sua conta
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Solicitar Cadastro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <div key={pet.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{pet.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.especie} • {pet.raca}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum pet cadastrado ainda.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Consultas Recentes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Consultas Recentes</CardTitle>
                  <CardDescription>
                    Suas consultas mais recentes
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Agendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultas.length > 0 ? (
                  consultas.map((consulta) => (
                    <div key={consulta.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{consulta.pets.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(consulta.data_consulta).toLocaleDateString('pt-BR')} às {consulta.hora_consulta}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dr(a). {consulta.veterinarios?.nome}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(consulta.status)}>
                        {consulta.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma consulta encontrada.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Vacinas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Vacinas</CardTitle>
              <CardDescription>
                Vacinas com vencimento próximo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacinas.length > 0 ? (
                  vacinas.map((vacina) => (
                    <div key={vacina.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{vacina.nome_vacina}</p>
                        <p className="text-sm text-muted-foreground">
                          {vacina.pets.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Próxima dose: {new Date(vacina.proxima_dose!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Pendente
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma vacina pendente.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Suas notificações não lidas
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificacoes.length > 0 ? (
                  notificacoes.map((notificacao) => (
                    <div key={notificacao.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{notificacao.titulo}</p>
                        <Badge variant="secondary" className="text-xs">
                          {notificacao.tipo}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notificacao.mensagem}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notificacao.data_envio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma notificação nova.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}