import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Eye, MousePointerClick, TrendingUp } from 'lucide-react'
import { EngagementChart } from '@/components/engagement-chart'

export default async function PublicReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Busca o deal com parceiro e entregáveis (sem autenticação)
    const { data: deal } = await supabase
        .from('deals')
        .select(`
            *,
            partners (
                name
            ),
            deliverables (
                *
            )
        `)
        .eq('id', id)
        .single()

    if (!deal) {
        return notFound()
    }

    const totalDeliverables = deal.deliverables?.length || 0
    const completedDeliverables = deal.deliverables?.filter((d: any) => d.status === 'posted').length || 0
    const progress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm font-bold tracking-widest uppercase opacity-80">Relatório de Campanha</div>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                                    {deal.status === 'active' ? 'Em Andamento' : 'Concluído'}
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{deal.partners?.name || 'Parceiro'}</h1>
                            <p className="text-xl opacity-90 font-medium">
                                {deal.notes || 'Campanha de Marketing de Influência'}
                            </p>
                        </div>
                    </div>

                    {/* KPI Grid (Mock Data) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-800 border-b border-gray-800">
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium uppercase">Alcance Estimado</span>
                            </div>
                            <div className="text-3xl font-bold text-white">125.4K</div>
                            <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12% vs. média
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                                <MousePointerClick className="w-4 h-4" />
                                <span className="text-sm font-medium uppercase">Cliques no Link</span>
                            </div>
                            <div className="text-3xl font-bold text-white">3,842</div>
                            <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
                                <TrendingUp className="w-3 h-3" /> CTR 3.1%
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-medium uppercase">Entregas</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{completedDeliverables}/{totalDeliverables}</div>
                            <div className="text-xs text-violet-400 mt-1">
                                {Math.round(progress)}% concluído
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="p-8 bg-gray-900/50">
                        <h3 className="text-lg font-semibold text-white mb-6">Performance de Engajamento</h3>
                        <div className="h-[300px] w-full">
                            <EngagementChart />
                        </div>
                    </div>
                </div>

                {/* Deliverables List */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <CheckCircle2 className="text-violet-500" />
                        Status das Entregas
                    </h2>

                    <div className="space-y-4">
                        {deal.deliverables?.map((deliverable: any) => (
                            <div
                                key={deliverable.id}
                                className={`flex items-center justify-between p-5 rounded-xl border transition-all ${deliverable.status === 'posted'
                                        ? 'bg-green-900/10 border-green-900/30'
                                        : 'bg-gray-800/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${deliverable.status === 'posted' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                        {deliverable.status === 'posted' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className={`font-semibold text-lg capitalize ${deliverable.status === 'posted' ? 'text-green-400' : 'text-white'}`}>
                                            {deliverable.type}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Prazo: {deliverable.due_date ? new Date(deliverable.due_date).toLocaleDateString('pt-BR') : 'Sem data'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {deliverable.status === 'posted' ? (
                                        <Badge className="bg-green-500/20 text-green-400 border-0">Entregue</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-gray-400 border-gray-600">Pendente</Badge>
                                    )}
                                </div>
                            </div>
                        ))}

                        {(!deal.deliverables || deal.deliverables.length === 0) && (
                            <div className="text-center py-12 text-gray-500">
                                Nenhuma entrega cadastrada neste acordo.
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center text-gray-500 text-sm py-8">
                    <p>Relatório gerado automaticamente por <strong>PubliFlow</strong></p>
                </div>
            </div>
        </div>
    )
}
