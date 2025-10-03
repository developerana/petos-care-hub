import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Bell, Search, FileText, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  peso: number | null;
  data_nascimento: string;
}

interface Consulta {
  id: string;
  data_consulta: string;
  hora_consulta: string;
  status: string;
  pets: {
    nome: string;
  };
  veterinarios: {
    nome: string;
  } | null;
}

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data_envio: string;
  lida: boolean;
}

interface Vacina {
  id: string;
  nome_vacina: string;
  proxima_dose: string;
  id_pet: string;
}

export default function DashboardTutor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tutorNome, setTutorNome] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTutorData();
  }, []);

  const loadTutorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Buscar dados do tutor através do acesso
      const { data: acesso } = await supabase
        .from("acessos_tutores")
        .select("id_tutor, tutores(nome)")
        .eq("user_id", user.id)
        .single();

      if (!acesso) {
        toast({
          title: "Acesso não encontrado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/auth");
        return;
      }

      setTutorNome(acesso.tutores.nome);

      // Buscar pets do tutor
      const { data: petsData } = await supabase
        .from("pets")
        .select("id, nome, especie, raca, data_nascimento, peso")
        .eq("id_tutor", acesso.id_tutor)
        .order("nome");

      setPets((petsData as any) || []);

      // Buscar consultas futuras
      const today = new Date().toISOString().split("T")[0];
      const { data: consultasData } = await supabase
        .from("consultas")
        .select(`
          *,
          pets!inner(nome, id_tutor),
          veterinarios(nome)
        `)
        .eq("pets.id_tutor", acesso.id_tutor)
        .gte("data_consulta", today)
        .order("data_consulta", { ascending: true })
        .order("hora_consulta", { ascending: true })
        .limit(5);

      setConsultas(consultasData || []);

      // Buscar notificações não lidas
      const { data: notificacoesData } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("id_tutor", acesso.id_tutor)
        .eq("lida", false)
        .order("data_envio", { ascending: false })
        .limit(5);

      setNotificacoes(notificacoesData || []);

      // Buscar vacinas próximas do vencimento
      const { data: vacinasData } = await supabase
        .from("vacinas")
        .select("*, pets!inner(id_tutor)")
        .eq("pets.id_tutor", acesso.id_tutor)
        .not("proxima_dose", "is", null)
        .order("proxima_dose", { ascending: true });

      setVacinas(vacinasData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getVacinaStatus = (proximaDose: string) => {
    const hoje = new Date();
    const dataVacina = new Date(proximaDose);
    const diasRestantes = Math.ceil((dataVacina.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return { label: "Vacinas Atrasadas", variant: "destructive" as const };
    if (diasRestantes <= 30) return { label: "Vacinas próximas", variant: "default" as const };
    return { label: "Vacinas em dia", variant: "secondary" as const };
  };

  const filteredPets = pets.filter((pet) =>
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const anos = hoje.getFullYear() - nascimento.getFullYear();
    const meses = hoje.getMonth() - nascimento.getMonth();
    
    if (anos === 0) return `${meses} meses`;
    return `${anos} anos`;
  };

  const proximasConsultas = consultas.slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PetOS</h1>
              <p className="text-sm text-muted-foreground">Tutor</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Search */}
            <div>
              <h2 className="text-3xl font-bold mb-2">Meus Pets</h2>
              <p className="text-muted-foreground">
                Acompanhe os dados e o histórico de saúde dos seus animais
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Pets</p>
                      <p className="text-3xl font-bold">{pets.length}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Próximas Consultas</p>
                      <p className="text-3xl font-bold">{consultas.length}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Notificações</p>
                      <p className="text-3xl font-bold">{notificacoes.length}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Pets Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Meus Pets ({filteredPets.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPets.map((pet) => {
                  const petVacinas = vacinas.filter((v) => v.id_pet === pet.id);
                  const vacinaStatus = petVacinas.length > 0 
                    ? getVacinaStatus(petVacinas[0].proxima_dose)
                    : { label: "Vacinas em dia", variant: "secondary" as const };

                  return (
                    <Card key={pet.id} className="overflow-hidden">
                      <div className="bg-primary/10 h-32 flex items-center justify-center">
                        <Heart className="h-16 w-16 text-primary" />
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{pet.nome}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pet.especie} - {pet.raca}
                            </p>
                          </div>
                          <Badge variant={vacinaStatus.variant}>
                            {vacinaStatus.label}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                          <p>Idade: {calcularIdade(pet.data_nascimento)}</p>
                          <p>Peso: {pet.peso ? `${pet.peso}kg` : "Não informado"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/prontuario/${pet.id}`)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            Agendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Próximas Consultas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Consultas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {proximasConsultas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma consulta agendada
                  </p>
                ) : (
                  proximasConsultas.map((consulta) => (
                    <div
                      key={consulta.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{consulta.pets.nome}</p>
                        <Badge variant="outline">
                          {consulta.status === "Agendada" ? "Consulta se retina" : consulta.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(consulta.data_consulta), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}{" "}
                        às {consulta.hora_consulta.slice(0, 5)}
                      </p>
                      <p className="text-sm">
                        Dr. {consulta.veterinarios?.nome || "Não definido"}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                  </CardTitle>
                  {notificacoes.length > 0 && (
                    <Badge variant="destructive">{notificacoes.length}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notificacoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma notificação nova
                  </p>
                ) : (
                  notificacoes.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className="border rounded-lg p-3 space-y-1"
                    >
                      <p className="font-semibold text-sm">{notificacao.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {notificacao.mensagem}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
