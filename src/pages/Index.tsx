// Update this page (PetOS Landing Page)
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";
const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/src/img/PetOs.svg" alt="Logo PetOS" className="w-20" />
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-primary">Início Rápido</a>
          <a href="#" className="hover:text-primary">Como Funciona</a>
          <a href="#" className="hover:text-primary">Sobre nós</a>
        </nav>
        <a
          href="/login"
          className="px-6 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90"
        >
          Entrar
        </a>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 py-16 max-w-6xl mx-auto bg-white">
        <div className="max-w-xl text-center md:text-left space-y-4">
          <img
            src="/src/img/PetOs.svg"
            alt="Logo PetOS"
            className="mx-auto md:mx-0 w-28"
          />
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Gestão Eficiente para Clínicas Veterinárias
          </h1>
          <p className="text-muted-foreground">
            Nosso assistente de gestão oferece soluções práticas para otimizar o
            dia a dia da sua clínica veterinária. Com funcionalidades como
            agendamento online, controle de prontuários e vacinas, você terá
            mais tempo para o que realmente importa: cuidar dos seus pacientes.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href="/login"
              className="px-6 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90"
            >
              Login
            </a>
            <a
              href="/registrar"
              className="px-6 py-2 rounded-xl bg-secondary text-black font-semibold hover:bg-secondary/90"
            >
              Criar Conta
            </a>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:ml-8">
          <img
            src="/src/img/medvet.svg"
            alt="Ilustração Veterinária"
            className="w-96"
          />
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-20 px-8 bg-white">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="uppercase text-sm font-semibold text-primary">
            Funcionalidades
          </span>
          <h2 className="text-3xl font-bold">
            Descubra as principais funcionalidades do sistema
          </h2>
          <p className="text-muted-foreground">
            Nosso sistema oferece uma gama de funcionalidades para facilitar o
            cuidado com seu pet. <br /> Com ele, você pode agendar consultas,
            acompanhar prontuários e gerenciar vacinas com praticidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <img
              src="/src/img/agendamentoonline.svg"
              alt="Agendamento Online"
              className="mx-auto w-60"
            />
            <h3 className="font-semibold text-lg">Agendamento Online</h3>
            <p className="text-muted-foreground">
              Agende consultas de maneira rápida e fácil.
            </p>
          </div>
          <div className="text-center space-y-3">
            <img
              src="/src/img/prontuarioeletronico.svg"
              alt="Prontuário Eletrônico"
              className="mx-auto w-60"
            />
            <h3 className="font-semibold text-lg">Prontuário Eletrônico</h3>
            <p className="text-muted-foreground">
              Acompanhe o histórico de saúde do seu pet.
            </p>
          </div>
          <div className="text-center space-y-3">
            <img
              src="/src/img/cotroledevacinação.svg"
              alt="Controle de Vacinas"
              className="mx-auto w-60"
            />
            <h3 className="font-semibold text-lg">Controle de Vacinas</h3>
            <p className="text-muted-foreground">
              Gerencie as vacinas do seu animal com facilidade.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-12 max-w-6xl mx-auto">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold">Junte-se a nós!</h2>
            <p className="text-muted-foreground">
              Cadastre-se agora ou faça login e tenha acesso a todos os nossos serviços!
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="/login"
                className="px-6 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90"
              >
                Login
              </a>
              <a
                href="/registrar"
                className="px-6 py-2 rounded-xl bg-secondary text-black font-semibold hover:bg-secondary/90"
              >
                Cadastrar
              </a>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <img src="/src/img/cta.svg" alt="Ilustração CTA" className="w-80" />
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Logo */}
          <img
            src="/src/img/PetOs.svg"
            alt="Logo PetOS"
            className="mx-auto md:mx-0 w-28"
          />

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://www.facebook.com/somospetos" className="text-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/usepetos/" className="text-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://x.com/usepetos" className="text-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>  
            <a href="https://www.linkedin.com/company/oficialpetos/" className="text-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom Links and Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 PetOS. Todos os direitos reservados.
            </p>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Termos de Serviço
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Configurações de Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Index;
