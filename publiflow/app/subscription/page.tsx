import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Zap, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SubscriptionPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center space-y-8">

                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
                        <Shield className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Seu período de teste acabou 😢
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Para continuar organizando suas parcerias e gerando relatórios profissionais, escolha um dos planos abaixo.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
                    {/* Plano Mensal */}
                    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 flex flex-col relative hover:border-violet-500/30 transition-all">
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Mensal</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">R$ 49,90</span>
                            <span className="text-gray-500">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-violet-500" /> Acesso total à plataforma
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-violet-500" /> Cancele quando quiser
                            </li>
                        </ul>
                        <Button className="w-full h-12 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold">
                            Assinar Mensal
                        </Button>
                    </div>

                    {/* Plano Anual */}
                    <div className="bg-gray-900 rounded-3xl p-8 border border-violet-500 flex flex-col relative shadow-2xl shadow-violet-500/10 scale-105">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            Melhor Escolha
                        </div>
                        <h3 className="text-xl font-semibold text-violet-400 mb-2">Anual</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">R$ 39,90</span>
                            <span className="text-gray-500">/mês</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Cobrado anualmente (R$ 478,80)</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-violet-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-violet-400" /></div>
                                2 meses grátis (Economia de 20%)
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-violet-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-violet-400" /></div>
                                Prioridade no suporte
                            </li>
                        </ul>
                        <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold shadow-lg">
                            Assinar Anual
                        </Button>
                    </div>
                </div>

                <div className="pt-8">
                    <Link href="/dashboard">
                        <Button variant="link" className="text-gray-500 hover:text-gray-400">
                            Voltar para o Dashboard (apenas se tiver resolvido)
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
