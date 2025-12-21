import Image from 'next/image'

const founders = [
  {
    name: 'Renato de Faria e Almeida Prado',
    role: 'Estratégia e Governança',
    image: '/images/landing/rfap.jpg',
    bio: 'Quase 30 anos em conselhos, inovação e liderança. Atua na intersecção entre governança e inteligência artificial.',
  },
  {
    name: 'Renato DAP',
    role: 'Tecnologia e IA',
    image: '/images/landing/rdap.jpg',
    bio: 'Engenheiro especializado em inteligência artificial e sistemas full-stack. Lidera a implementação técnica.',
  },
]

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 lg:py-24 bg-navy-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-4 block">
          Quem somos
        </span>
        <h2 className="text-2xl lg:text-3xl font-medium text-white mb-16 max-w-2xl">
          Experiência estratégica e capacidade técnica, lado a lado.
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {founders.map((founder, index) => (
            <div key={index} className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-0.5">
                  {founder.name}
                </h3>
                <p className="text-gold-500 text-sm mb-3">{founder.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {founder.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
