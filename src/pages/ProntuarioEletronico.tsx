import { useState } from "react";
import { AnimalHeader } from "@/components/AnimalHeader";
import { TabNavigation, TabType } from "@/components/TabNavigation";
import { DadosTab } from "@/components/tabs/DadosTab";
import { TutorTab } from "@/components/tabs/TutorTab";
import { HistoricoTab } from "@/components/tabs/HistoricoTab";
import { VacinacaoTab } from "@/components/tabs/VacinacaoTab";
import { ConsultasTab } from "@/components/tabs/ConsultasTab";
import { TratamentoTab } from "@/components/tabs/TratamentoTab";
import { FinanceiroTab } from "@/components/tabs/FinanceiroTab";
import { ProntuarioFooter } from "@/components/ProntuarioFooter";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("historico");

  const animalData = {
    name: "",
    species: "",
    breed: "",
    sex: "",
    age: " ",
    tutor: "",
    microchip: "",
    id: "",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dados":
        return <DadosTab />;
      case "tutor":
        return <TutorTab />;
      case "historico":
        return <HistoricoTab />;
      case "vacinacao":
        return <VacinacaoTab />;
      case "consultas":
        return <ConsultasTab />;
      case "tratamento":
        return <TratamentoTab />;
      case "financeiro":
        return <FinanceiroTab />;
      default:
        return <HistoricoTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-medical flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Clínica Veterinária VetCare</h1>
              <p className="text-sm text-muted-foreground">Sistema de Prontuário Eletrônico</p>
            </div>
          </div>
        </div>

        <AnimalHeader animal={animalData} />
        
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="min-h-[400px]">{renderTabContent()}</div>
        
        <ProntuarioFooter />
      </div>
    </div>
  );
};

export default Index;
