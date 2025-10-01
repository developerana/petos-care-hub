import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Paperclip, Heart } from "lucide-react";
import { usePet } from "@/hooks/usePets";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Import tab components
import DadosAnimalTab from "@/components/prontuario/DadosAnimalTab";
import DadosTutorTab from "@/components/prontuario/DadosTutorTab";
import HistoricoClinicoTab from "@/components/prontuario/HistoricoClinicoTab";
import VacinacaoTab from "@/components/prontuario/VacinacaoTab";
import ConsultasExamesTab from "@/components/prontuario/ConsultasExamesTab";
import TratamentoTab from "@/components/prontuario/TratamentoTab";
import FinanceiroTab from "@/components/prontuario/FinanceiroTab";

export default function Prontuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading } = usePet(id!);
  const [activeTab, setActiveTab] = useState("dados-animal");

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const diffTime = Math.abs(hoje.getTime() - nascimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} meses`;
    } else {
      return `${Math.floor(diffDays / 365)} anos`;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando prontuário...</p>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Pet não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Cabeçalho com foto e dados do animal */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6 flex-1">
              {/* Foto do Animal */}
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-4xl bg-primary/10">
                  <Heart className="h-16 w-16 text-primary" />
                </AvatarFallback>
              </Avatar>

              {/* Informações básicas */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{pet.nome}</h1>
                  <Badge variant="secondary">{pet.especie}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <div><strong>Raça:</strong> {pet.raca || "Não informado"}</div>
                  <div><strong>Sexo:</strong> {pet.sexo || "Não informado"}</div>
                  <div><strong>Idade:</strong> {calcularIdade(pet.data_nascimento)}</div>
                  <div><strong>Cor:</strong> {pet.cor || "Não informado"}</div>
                  <div><strong>Tutor:</strong> {pet.tutor?.nome}</div>
                  <div><strong>Microchip:</strong> {pet.microchip || "Não cadastrado"}</div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
                Anexar
              </Button>
            </div>
          </div>

          {/* Sistema de Abas */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="dados-animal">Dados do Animal</TabsTrigger>
              <TabsTrigger value="tutor">Tutor</TabsTrigger>
              <TabsTrigger value="historico">Histórico Clínico</TabsTrigger>
              <TabsTrigger value="vacinacao">Vacinação</TabsTrigger>
              <TabsTrigger value="consultas">Consultas/Exames</TabsTrigger>
              <TabsTrigger value="tratamento">Tratamento</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-animal">
              <DadosAnimalTab pet={pet} />
            </TabsContent>

            <TabsContent value="tutor">
              <DadosTutorTab tutorId={pet.id_tutor} />
            </TabsContent>

            <TabsContent value="historico">
              <HistoricoClinicoTab petId={pet.id} />
            </TabsContent>

            <TabsContent value="vacinacao">
              <VacinacaoTab petId={pet.id} />
            </TabsContent>

            <TabsContent value="consultas">
              <ConsultasExamesTab petId={pet.id} />
            </TabsContent>

            <TabsContent value="tratamento">
              <TratamentoTab petId={pet.id} />
            </TabsContent>

            <TabsContent value="financeiro">
              <FinanceiroTab petId={pet.id} />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Rodapé */}
        <Card className="p-4 bg-muted/50">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              <strong>Última atualização:</strong> {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </div>
            <div>
              <strong>Assinatura Digital:</strong> Veterinário Responsável
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}