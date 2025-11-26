import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Package, DollarSign } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch KPI Data
    const { count: activeDealsCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    const { count: pendingDeliverablesCount } = await supabase
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    const { data: activeDeals } = await supabase
        .from('deals')
        .select('estimated_value')
        .eq('status', 'active')

    const estimatedRevenue = activeDeals?.reduce((sum, deal) => sum + (Number(deal.estimated_value) || 0), 0) || 0

    // Fetch Upcoming Deliverables
    const { data: upcomingDeliverables } = await supabase
        .from('deliverables')
        .select(`
      *,
      deals (
        partners (
          name
        )
      )
    `)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Visão geral das suas parcerias e entregas</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="h-8 w-8 text-white opacity-80" />
                        <span className="text-violet-200 text-sm font-medium">Parcerias</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{activeDealsCount || 0}</div>
                    <p className="text-violet-200 text-sm">Acordos ativos</p>
                </div>

                <div className="bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <Package className="h-8 w-8 text-white opacity-80" />
                        <span className="text-fuchsia-200 text-sm font-medium">Entregas</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{pendingDeliverablesCount || 0}</div>
                    <p className="text-fuchsia-200 text-sm">Pendentes</p>
                </div>

                <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="h-8 w-8 text-white opacity-80" />
                        <span className="text-pink-200 text-sm font-medium">Receita</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimatedRevenue)}
                    </div>
                    <p className="text-pink-200 text-sm">Faturamento previsto</p>
                </div>
            </div>

            {/* Upcoming Deliverables Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Próximas Entregas</h2>
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50 border-b border-gray-800">
                            <tr>
                                <th className="p-4 text-left font-medium text-gray-300">Data Limite</th>
                                <th className="p-4 text-left font-medium text-gray-300">Tipo</th>
                                <th className="p-4 text-left font-medium text-gray-300">Parceiro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingDeliverables?.map((deliverable: any) => (
                                <tr key={deliverable.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 text-gray-300">
                                        {deliverable.due_date ? new Date(deliverable.due_date).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                    <td className="p-4 capitalize text-gray-300">{deliverable.type}</td>
                                    <td className="p-4 text-gray-300">{deliverable.deals?.partners?.name || '-'}</td>
                                </tr>
                            ))}
                            {!upcomingDeliverables?.length && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">
                                        Nenhuma entrega pendente. Você está em dia! 🎉
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

