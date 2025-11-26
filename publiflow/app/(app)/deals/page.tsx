import { createClient } from '@/lib/supabase/server'
import { NewDealDialog } from '@/components/ui/new-deal-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Meus Acordos</h1>
                <NewDealDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Parceiro</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Tipo Pagamento</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!deals || deals.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Nenhum acordo ativo. Crie o primeiro!
                                </TableCell>
                            </TableRow>
                        ) : (
                            deals.map((deal) => (
                                <TableRow key={deal.id}>
                                    <TableCell className="font-medium">
                                        {/* Exibe o nome do parceiro ou 'Desconhecido' se der erro */}
                                        {deal.partners?.name || 'Parceiro Excluído'}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={deal.notes}>
                                        {deal.notes}
                                    </TableCell>
                                    <TableCell>{deal.payment_type}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.estimated_value || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                                            {deal.status === 'active' ? 'Ativo' : deal.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/deals/${deal.id}`} className="text-blue-500 hover:underline">
                                            Ver Detalhes
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}