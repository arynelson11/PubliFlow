import { createClient } from '@/lib/supabase/server'
import { NewDealDialog } from '@/components/ui/new-deal-dialog'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DealsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Busca os acordos e O NOME do parceiro conectado
    const { data: deals, error } = await supabase
        .from('deals')
        .select(`
      *,
      partners (
        name
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar deals:', error)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Meus Acordos</h1>
                    <p className="text-gray-400">Gerencie todas as suas parcerias ativas</p>
                </div>
                <NewDealDialog />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50 border-b border-gray-800">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-300">Parceiro</th>
                            <th className="p-4 text-left font-medium text-gray-300">Descrição</th>
                            <th className="p-4 text-left font-medium text-gray-300">Tipo Pagamento</th>
                            <th className="p-4 text-left font-medium text-gray-300">Valor</th>
                            <th className="p-4 text-left font-medium text-gray-300">Status</th>
                            <th className="p-4 text-left font-medium text-gray-300">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!deals || deals.length === 0) ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-gray-500 text-lg">Nenhum acordo cadastrado</div>
                                        <p className="text-gray-600 text-sm">Clique em "Novo Acordo" para começar</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            deals.map((deal) => (
                                <tr key={deal.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-medium text-gray-200">
                                        {deal.partners?.name || 'Parceiro Excluído'}
                                    </td>
                                    <td className="p-4 max-w-[200px] truncate text-gray-300" title={deal.notes}>
                                        {deal.notes || '-'}
                                    </td>
                                    <td className="p-4 text-gray-300">{deal.payment_type || '-'}</td>
                                    <td className="p-4 text-gray-300 font-medium">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.estimated_value || 0)}
                                    </td>
                                    <td className="p-4">
                                        <Badge
                                            variant={deal.status === 'active' ? 'default' : 'secondary'}
                                            className={deal.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        >
                                            {deal.status === 'active' ? 'Ativo' : deal.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/deals/${deal.id}`}
                                            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                                        >
                                            Ver Detalhes →
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}