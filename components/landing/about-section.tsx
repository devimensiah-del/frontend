'use client';

export function AboutSection() {
  const founders = [
    {
      name: "Renato de Faria e Almeida Prado",
      role: "Cofundador da IMENSIAH",
      bio: "Com quase 30 anos de trajetória em conselhos, inovação e liderança com propósito, Renato combina uma visão estratégica rara com a capacidade de traduzir complexidade em ação. Cofundador da 10xMentorAI e da IMENSIAH, atua na interseção entre governança e inteligência artificial, ajudando líderes a aplicarem tecnologia com sabedoria — e não apenas com velocidade. Sua missão é clara: tornar empresas e lideranças mais humanas, sustentáveis e exponenciais, unindo experiência, intuição e IA em um mesmo fluxo de decisão inteligente."
    },
    {
      name: "Daniela de Luca Brandão",
      role: "Cofundadora da IMENSIAH",
      bio: "Especialista em estratégia, gestão, arquitetura de processos e finanças, Daniela é a força analítica e criativa por trás da IMENSIAH. Sua trajetória une raciocínio estruturado e pensamento crítico com uma abordagem humana e inovadora para resolver problemas complexos. Na IMENSIAH, lidera a integração entre eficiência operacional e inteligência estratégica, garantindo que cada solução seja precisa, prática e orientada a resultados reais."
    },
    {
      name: "Renato DAP",
      role: "Cofundador da IMENSIAH",
      bio: "Engenheiro e desenvolvedor especializado em inteligência artificial e sistemas full-stack. Atualmente cursando Ciência da Computação com foco em Deep Learning e AI Research na Rose-Hulman Institute of Technology, combina expertise técnica em IA (GPT-4, RAG, PyTorch) com habilidades práticas de desenvolvimento (Next.js, React Native, Golang). Criador de soluções inovadoras que unem tecnologia e impacto real, desde assistentes culinários com comando de voz até plataformas de fitness adaptativas com IA. Na IMENSIAH, lidera a implementação técnica das soluções de inteligência artificial, garantindo que a tecnologia sirva à estratégia com excelência e inovação."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="sobre">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Sobre nós
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça os fundadores que unem décadas de experiência com visão de futuro
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary/5 to-accent/5 text-foreground rounded-xl p-6 md:p-8 hover:shadow-medium transition-shadow duration-300"
            >
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {founder.name}
              </h3>
              <p className="text-accent font-semibold mb-4 text-sm md:text-base">{founder.role}</p>
              <p className="text-foreground leading-relaxed text-sm md:text-base">{founder.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
