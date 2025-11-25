import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { DeliverableChecklist } from '@/components/deliverable-checklist'
import { AddDeliverableDialog } from '@/components/ui/add-deliverable-dialog'
import { ShareButton } from '@/components/share-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Busca o deal com parceiro e entregáveis
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
        redirect('/deals')
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <Link href="/deals" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Acordos
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{deal.partners?.name || 'Parceiro'}</h1>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Valor: <strong className="text-foreground">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.estimated_value || 0)}
                            </strong></span>
                            <span>Status: <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                                {deal.status === 'active' ? 'Ativo' : deal.status}
                            </Badge></span>
                        </div>
                    </div>
                    <ShareButton dealId={id} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Entregas</h2>
                    <AddDeliverableDialog dealId={id} />
                </div>

                <DeliverableChecklist deliverables={deal.deliverables || []} />
            </div>
        </div>
    )
}
