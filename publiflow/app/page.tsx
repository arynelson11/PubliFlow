import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star, Zap, TrendingUp, Shield, Layers, Users, Rocket } from 'lucide-react'
import Image from 'next/image' // Para usar a tag <Image>

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-violet-600 selection:text-white">

      {/* Navbar Flutuante */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
            <div className="bg-violet-600 text-white p-1.5 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span>PubliFlow</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-gray-300 hover:bg-gray-800 hover:text-violet-400">Login</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 shadow-lg shadow-violet-500/20 font-bold px-6 text-white transition-all">
                Criar Conta Grátis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section Moderno */}
      <main className="flex-1 pt-32 pb-20">
        <section className="container mx-auto px-4 text-center relative">
          {/* Badge de Novidade */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-violet-400 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            A ferramenta nº 1 para Creators no Brasil
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Pare de perder parcerias no <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Direct do Instagram.
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Organize seus recebidos, gere relatórios profissionais em 1 clique e
            mostre para as marcas que você é um creator de elite.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login?tab=register">
              <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-white hover:bg-gray-100 text-slate-900 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4 sm:mt-0">
              *Não precisa de cartão de crédito
            </p>
          </div>

          {/* Imagem do Produto */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-4 shadow-2xl">
              {/* Substitua por uma imagem real do seu dashboard */}
              <Image
                src="https://via.placeholder.com/1200x600/1e293b/a8a29e?text=Mockup+Dashboard+PubliFlow"
                alt="Mockup do Dashboard PubliFlow"
                width={1200}
                height={600}
                className="rounded-2xl border border-gray-700"
              />
            </div>
          </div>
        </section>

        {/* Seção de Benefícios Detalhados */}
        <section className="py-24 bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Como o PubliFlow vai transformar suas parcerias</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-16">
              Organize, automatize e impressione marcas como nunca antes.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <BenefitCard
                icon={<Layers className="h-7 w-7 text-violet-400" />}
                title="Gestão Unificada"
                description="Centralize todos os seus recebidos, prazos e conversas em um só lugar."
              />
              <BenefitCard
                icon={<Rocket className="h-7 w-7 text-fuchsia-400" />}
                title="Relatórios Mágicos"
                description="Crie links de relatórios profissionais em segundos, sem planilhas ou PDFs."
              />
              <BenefitCard
                icon={<Users className="h-7 w-7 text-pink-400" />}
                title="Conexão com Marcas"
                description="Mostre resultados claros e construa uma reputação sólida para futuras parcerias."
              />
              <BenefitCard
                icon={<Check className="h-7 w-7 text-green-400" />}
                title="Automatização de Prazos"
                description="Receba alertas e nunca mais perca uma data de entrega de conteúdo."
              />
              <BenefitCard
                icon={<Star className="h-7 w-7 text-yellow-400" />}
                title="Feedback Instantâneo"
                description="Veja o progresso das suas entregas e receba feedback em tempo real."
              />
              <BenefitCard
                icon={<Shield className="h-7 w-7 text-blue-400" />}
                title="Dados Seguros"
                description="Seus dados e de suas parcerias protegidos com a mais alta tecnologia."
              />
            </div>
          </div>
        </section>

        {/* Seção de Testemunhos */}
        <section className="py-24 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">O que os Creators estão dizendo</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-16">
              Veja como o PubliFlow está mudando o jogo para influenciadores como você.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                image="https://randomuser.me/api/portraits/women/68.jpg"
                name="Ana Clara, @influencia_ela"
                quote="Antes era uma bagunça! Agora consigo organizar tudo e mostrar para as marcas um trabalho de verdade. O PubliFlow salvou minha carreira!"
              />
              <TestimonialCard
                image="https://randomuser.me/api/portraits/men/45.jpg"
                name="Lucas Mkt, @lucas_digital"
                quote="Meus relatórios agora são feitos em 1 minuto e ficam com uma cara super profissional. As marcas amam a clareza. Essencial para quem é creator!"
              />
              <TestimonialCard
                image="https://randomuser.me/api/portraits/women/79.jpg"
                name="Mariana P., @vida_de_creator"
                quote="A interface é linda, super fácil de usar! Consigo acompanhar todos os meus recebidos e nunca mais perdi um prazo. Recomendo demais!"
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="py-10 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 font-medium">PubliFlow © 2025</p>
          <p className="text-gray-500 text-sm mt-2">Feito com 💜 para creators brasileiros.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-800 hover:shadow-xl hover:border-violet-700 transition-all duration-300 group">
      <div className="h-14 w-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-violet-800">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: any) {
  return (
    <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-800 hover:shadow-xl hover:border-fuchsia-700 transition-all duration-300">
      <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
        {icon}
      </div>
      <h3 className="font-bold text-2xl mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ image, name, quote }: any) {
  return (
    <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-800 hover:shadow-xl hover:border-pink-700 transition-all duration-300 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-violet-600 shadow-lg">
        <Image src={image} alt={name} width={80} height={80} objectFit="cover" />
      </div>
      <p className="text-gray-300 italic mb-4">"{quote}"</p>
      <p className="font-bold text-white text-lg">{name}</p>
    </div>
  )
}