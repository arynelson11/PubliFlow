import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-react'

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
        redirect('/login')
    }

    const totalDeliverables = deal.deliverables?.length || 0
    const completedDeliverables = deal.deliverables?.filter((d: any) => d.status === 'posted').length || 0
    const progress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium opacity-90">PubliFlow</div>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                            {deal.status === 'active' ? 'Ativo' : 'Concluído'}
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{deal.partners?.name || 'Parceiro'}</h1>
                    <p className="text-xl opacity-90">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.estimated_value || 0)}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="px-8 py-6 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Progresso do Acordo</h2>
                        <span className="text-sm font-medium text-gray-600">
                            {completedDeliverables} de {totalDeliverables} entregues
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-2 text-right text-sm text-gray-500">
                        {Math.round(progress)}% completo
                    </div>
                </div>

                {/* Deliverables */}
                <div className="px-8 py-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Entregas</h2>

                    {/* Completed */}
                    {completedDeliverables > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-4">
                                ✓ Concluídas ({completedDeliverables})
                            </h3>
                            <div className="space-y-3">
                                {deal.deliverables
                                    ?.filter((d: any) => d.status === 'posted')
                                    .map((deliverable: any) => (
                                        <div key={deliverable.id} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 capitalize">{deliverable.type}</div>
                                                <div className="text-sm text-gray-600">
                                                    Prazo: {deliverable.due_date ? new Date(deliverable.due_date).toLocaleDateString('pt-BR') : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Pending */}
                    {totalDeliverables - completedDeliverables > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                                Pendentes ({totalDeliverables - completedDeliverables})
                            </h3>
                            <div className="space-y-3">
                                {deal.deliverables
                                    ?.filter((d: any) => d.status !== 'posted')
                                    .map((deliverable: any) => (
                                        <div key={deliverable.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <Circle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 opacity-70">
                                                <div className="font-medium text-gray-700 capitalize">{deliverable.type}</div>
                                                <div className="text-sm text-gray-500">
                                                    Prazo: {deliverable.due_date ? new Date(deliverable.due_date).toLocaleDateString('pt-BR') : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {totalDeliverables === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Nenhuma entrega cadastrada ainda.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t text-center text-sm text-gray-500">
                    Relatório gerado por PubliFlow
                </div>
            </div>
        </div>
    )
}
