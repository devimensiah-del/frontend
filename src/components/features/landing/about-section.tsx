import Image from 'next/image'

const founders = [
  {
    name: 'Renato de Faria e Almeida Prado',
    role: 'Cofundador da IMENSIAH',
    image: '/images/landing/rfap.jpg',
    bio: 'Com quase 30 anos de trajetória em conselhos, inovação e liderança com propósito, Renato combina uma visão estratégica rara com a capacidade de traduzir complexidade em ação. Cofundador da 10xMentorAI e da IMENSIAH, atua na intersecção entre governança e inteligência artificial, ajudando líderes a aplicarem tecnologia com sabedoria.',
  },
  {
    name: 'Daniela de Luca Brandão',
    role: 'Cofundadora da IMENSIAH',
    image: '/images/landing/dlb.jpg',
    bio: 'Especialista em estratégia, gestão, arquitetura de processos e finanças, Daniela é a força analítica e criativa por trás da IMENSIAH. Sua trajetória une raciocínio estruturado e pensamento crítico com uma abordagem humana e inovadora para resolver problemas complexos.',
  },
  {
    name: 'Renato DAP',
    role: 'Cofundador da IMENSIAH',
    image: '/images/landing/rdap.jpg',
    bio: 'Engenheiro e desenvolvedor especializado em inteligência artificial e sistemas full-stack. Combina expertise técnica em IA (GPT-4, RAG, PyTorch) com habilidades práticas de desenvolvimento (Next.js, React Native, Golang). Na IMENSIAH, lidera a implementação técnica das soluções de inteligência artificial.',
  },
]

export function AboutSection() {
  return (
    <section id="sobre" className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-4 block">
            Sobre nós
          </span>
          <h2 className="text-3xl lg:text-5xl font-medium text-white">
            Conheça os fundadores que unem décadas de experiência com visão de
            futuro
          </h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row gap-8 items-center lg:items-start"
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-500/30">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {founder.name}
                </h3>
                <p className="text-gold-500 text-sm mb-4">{founder.role}</p>
                <p className="text-gray-400 leading-relaxed">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
