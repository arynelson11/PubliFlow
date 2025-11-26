import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star, Zap, TrendingUp, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-violet-100">

      {/* Navbar Flutuante */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <div className="bg-violet-600 text-white p-1 rounded-lg">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span>PubliFlow</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium hover:bg-violet-50 hover:text-violet-700">Login</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button className="rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200 font-bold px-6">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            A ferramenta nº 1 para Creators no Brasil
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Pare de perder parcerias no <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">
              Direct do Instagram.
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Organize seus recebidos, gere relatórios profissionais em 1 clique e
            mostre para as marcas que você é um creator de elite.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login?tab=register">
              <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400 mt-4 sm:mt-0">
              *Não precisa de cartão de crédito
            </p>
          </div>

          {/* Mockup/Imagem Ilustrativa (CSS Puro) */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-2xl">
              <div className="aspect-video bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
                <p className="text-slate-300 font-medium text-lg">Aqui iria um print do Dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo o que você precisa para crescer</h2>
              <p className="text-slate-500">Adeus planilhas chatas. Olá PubliFlow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-violet-600" />}
                title="Profissionalismo"
                description="Chega de mandar prints soltos no WhatsApp. Envie links profissionais."
              />
              <FeatureCard
                icon={<TrendingUp className="h-6 w-6 text-fuchsia-600" />}
                title="Mídia Kit Vivo"
                description="Seu histórico de parcerias organizado automaticamente para fechar novos contratos."
              />
              <FeatureCard
                icon={<Star className="h-6 w-6 text-amber-500" />}
                title="Reputação 5 Estrelas"
                description="Nunca mais esqueça de postar. Cumpra prazos e ganhe a confiança das marcas."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 font-medium">PubliFlow © 2025</p>
          <p className="text-slate-400 text-sm mt-2">Feito com 💜 para creators brasileiros.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-100 transition-all duration-300 group">
      <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-violet-50">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}