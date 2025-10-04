import { cn } from "@/lib/utils";
import { 
  FileText, 
  User, 
  ClipboardList, 
  Syringe, 
  Stethoscope, 
  Pill, 
  DollarSign 
} from "lucide-react";

export type TabType = 
  | "dados" 
  | "tutor" 
  | "historico" 
  | "vacinacao" 
  | "consultas" 
  | "tratamento" 
  | "financeiro";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "dados" as TabType, label: "Dados do Animal", icon: FileText },
  { id: "tutor" as TabType, label: "Tutor", icon: User },
  { id: "historico" as TabType, label: "Histórico Clínico", icon: ClipboardList },
  { id: "vacinacao" as TabType, label: "Vacinação", icon: Syringe },
  { id: "consultas" as TabType, label: "Consultas/Exames", icon: Stethoscope },
  { id: "tratamento" as TabType, label: "Tratamento", icon: Pill },
  { id: "financeiro" as TabType, label: "Financeiro", icon: DollarSign },
];

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-medical"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
