'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

export function DeliverableChecklist({ deliverables }: { deliverables: any[] }) {
    const router = useRouter()
    const supabase = createClient()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    async function toggleStatus(id: string, currentStatus: string) {
        setLoadingId(id)

        // Se está 'posted' vira 'pending', se não vira 'posted'
        const newStatus = currentStatus === 'posted' ? 'pending' : 'posted'

        const { error } = await supabase
            .from('deliverables')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar:', error)
            alert('Erro ao atualizar status.')
        } else {
            router.refresh()
        }

        setLoadingId(null)
    }

    // Função simples para formatar data (YYYY-MM-DD -> DD/MM/YYYY)
    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    // Mapa de ícones/nomes bonitos
    const typeLabels: Record<string, string> = {
        story: '📸 Story',
        reel: '🎬 Reels',
        feed: '🖼️ Feed',
        tiktok: '🎵 TikTok'
    }

    if (!deliverables || deliverables.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                Nenhum item ainda. Adicione a primeira entrega!
            </div>
        )
    }

    return (
        <div className="space-y-4 mt-6">
            {deliverables.map((item) => (
                <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${item.status === 'posted' ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <Checkbox
                            checked={item.status === 'posted'}
                            onCheckedChange={() => toggleStatus(item.id, item.status)}
                            disabled={loadingId === item.id}
                        />

                        <div className={item.status === 'posted' ? 'opacity-50 line-through' : ''}>
                            <p className="font-medium text-lg capitalize">
                                {typeLabels[item.type] || item.type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Prazo: {formatDate(item.due_date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {item.status === 'posted' ? (
                            <Badge className="bg-green-600 hover:bg-green-700">Feito</Badge>
                        ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Pendente
                            </Badge>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}