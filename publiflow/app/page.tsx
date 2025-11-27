'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star, Zap, Layers, Users, Rocket, Shield } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white selection:bg-violet-600 selection:text-white overflow-x-hidden">

      {/* Navbar Flutuante */}
      <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
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
        <section className="container mx-auto px-4 text-center relative pb-20">
          {/* Badge de Novidade */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-violet-400 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            A ferramenta nº 1 para Creators no Brasil
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]"
          >
            Pare de perder parcerias no <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Direct do Instagram.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Organize seus recebidos, gere relatórios profissionais em 1 clique e
            mostre para as marcas que você é um creator de elite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/login?tab=register">
              <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-white hover:bg-gray-100 text-slate-900 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4 sm:mt-0">
              *Teste grátis por 7 dias
            </p>
          </motion.div>

          {/* Imagem Abstrata (Dashboard Substituta) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative mx-auto max-w-5xl p-6 md:p-8 rounded-3xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Dashboard PubliFlow"
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Seção "Por Dentro" (Showcase Bento Grid) */}
        <section className="py-24 bg-gray-950 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Tudo o que você precisa em um só lugar</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Uma suíte completa de ferramentas desenhada para impulsionar sua carreira de creator.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Card Grande - Dashboard */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-gray-900 rounded-3xl p-8 border border-gray-800 overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layers className="w-32 h-32 text-violet-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Dashboard Intuitivo</h3>
                <p className="text-gray-400 mb-6">Visão geral dos seus ganhos, parcerias ativas e tarefas pendentes.</p>
                <div className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Dashboard Preview"
                    width={600}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>

              {/* Card Pequeno - Kanban */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-3xl p-8 border border-gray-800 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Check className="w-24 h-24 text-fuchsia-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Kanban de Tarefas</h3>
                <p className="text-gray-400 mb-6">Arraste e solte para organizar suas entregas.</p>
                <div className="rounded-xl overflow-hidden border border-gray-700 shadow-xl h-40 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2539&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Kanban Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Card Pequeno - Calendário */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-3xl p-8 border border-gray-800 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Rocket className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Calendário Editorial</h3>
                <p className="text-gray-400 mb-6">Planeje seu conteúdo com antecedência.</p>
                <div className="rounded-xl overflow-hidden border border-gray-700 shadow-xl h-40 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Calendar Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Card Grande - Relatórios */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 rounded-3xl p-8 border border-violet-500/30 overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-32 h-32 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Relatórios Profissionais</h3>
                <p className="text-gray-300 mb-6">Impressione marcas com dados claros e visuais.</p>
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Reports Preview"
                    width={600}
                    height={300}
                    className="w-full h-auto opacity-80"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Seção de Preços (Pricing) */}
        <section className="py-24 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Escolha o plano ideal para você</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Comece grátis e faça upgrade conforme você cresce.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plano Mensal */}
              <div className="bg-gray-950 rounded-3xl p-8 border border-gray-800 flex flex-col relative">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Mensal</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">R$ 49,90</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-gray-400 mb-8">Flexibilidade total para quem está começando.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-violet-500" /> Gestão de Parcerias Ilimitada
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-violet-500" /> Relatórios Básicos
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-violet-500" /> Calendário de Conteúdo
                  </li>
                </ul>
                <Link href="/login?tab=register" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-gray-700 hover:bg-gray-800 hover:text-white">
                    Começar Teste Grátis
                  </Button>
                </Link>
              </div>

              {/* Plano Anual */}
              <div className="bg-gray-950 rounded-3xl p-8 border border-violet-500/50 flex flex-col relative shadow-2xl shadow-violet-500/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Mais Popular
                </div>
                <h3 className="text-xl font-semibold text-violet-400 mb-2">Anual</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">R$ 39,90</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-gray-400 mb-8">Economize 20% assinando o plano anual.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-white">
                    <div className="bg-violet-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-violet-400" /></div>
                    Tudo do plano mensal
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="bg-violet-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-violet-400" /></div>
                    Relatórios Avançados (PDF)
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="bg-violet-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-violet-400" /></div>
                    Suporte Prioritário
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="bg-violet-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-violet-400" /></div>
                    Acesso Antecipado a Features
                  </li>
                </ul>
                <Link href="/login?tab=register" className="w-full">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold shadow-lg">
                    Começar Teste Grátis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Benefícios Detalhados */}
        <section className="py-24 bg-gray-950 border-t border-gray-800">
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
        <section className="py-24 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">O que os Creators estão dizendo</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-16">
              Veja como o PubliFlow está mudando o jogo para influenciadores como você.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testemunho 1: Ana Clara */}
              <TestimonialCard
                image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                name="Ana Clara, @influencia_ela"
                quote="Antes era uma bagunça! Agora consigo organizar tudo e mostrar para as marcas um trabalho de verdade. O PubliFlow salvou minha carreira!"
              />
              {/* Testemunho 2: Lucas Mkt */}
              <TestimonialCard
                image="https://images.unsplash.com/photo-1506794778202-dfa929654546?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                name="Lucas Mkt, @lucas_digital"
                quote="Meus relatórios agora são feitos em 1 minuto e ficam com uma cara super profissional. As marcas amam a clareza. Essencial para quem é creator!"
              />
              {/* Testemunho 3: Mariana P. */}
              <TestimonialCard
                image="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
      <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-violet-600 shadow-lg relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <p className="text-gray-300 italic mb-4">"{quote}"</p>
      <p className="font-bold text-white text-lg">{name}</p>
    </div>
  )
}