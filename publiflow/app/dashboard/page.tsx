import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch KPI Data
    const { count: activeDealsCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')

    const { count: pendingDeliverablesCount } = await supabase
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

    const { data: activeDeals } = await supabase
        .from('deals')
        .select('valor_estimado')
        .eq('status', 'ativo')

    const estimatedRevenue = activeDeals?.reduce((sum, deal) => sum + (Number(deal.valor_estimado) || 0), 0) || 0

    // Fetch Upcoming Deliverables
    const { data: upcomingDeliverables } = await supabase
        .from('deliverables')
        .select(`
      *,
      deals (
        partners (
          nome
        )
      )
    `)
        .eq('status', 'pendente')
        .order('data_limite', { ascending: true })
        .limit(5)

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Parcerias Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeDealsCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingDeliverablesCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faturamento Previsto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimatedRevenue)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Deliverables Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Próximas Entregas</h2>
                <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 font-medium">Data Limite</th>
                                <th className="p-4 font-medium">Tipo</th>
                                <th className="p-4 font-medium">Parceiro</th>
                                <th className="p-4 font-medium">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingDeliverables?.map((deliverable: any) => (
                                <tr key={deliverable.id} className="border-t">
                                    <td className="p-4">
                                        {deliverable.data_limite ? new Date(deliverable.data_limite).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                    <td className="p-4 capitalize">{deliverable.tipo}</td>
                                    <td className="p-4">{deliverable.deals?.partners?.nome || '-'}</td>
                                    <td className="p-4">
                                        {deliverable.link_prova ? (
                                            <a href={deliverable.link_prova} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                Ver Link
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!upcomingDeliverables?.length && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        Nenhuma entrega pendente.
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
