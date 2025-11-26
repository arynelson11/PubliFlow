'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, MoreVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DeliverableChecklist({ deliverables }: { deliverables: any[] }) {
    const router = useRouter()
    const supabase = createClient()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    async function toggleStatus(id: string, currentStatus: string) {
        setLoadingId(id)

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

    async function deleteItem(id: string) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return

        setLoadingId(id)
        const { error } = await supabase.from('deliverables').delete().eq('id', id)

        if (error) {
            console.error('Erro ao excluir:', error)
            alert('Erro ao excluir item.')
        } else {
            router.refresh()
        }
        setLoadingId(null)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    const typeLabels: Record<string, string> = {
        story: '📸 Story',
        reel: '🎬 Reels',
        feed: '🖼️ Feed',
        tiktok: '🎵 TikTok'
    }

    if (!deliverables || deliverables.length === 0) {
        return (
            <div className="p-12 text-center border border-dashed border-gray-700 rounded-xl bg-gray-900/50">
                <div className="text-gray-400 mb-2">Nenhum item de entrega cadastrado</div>
                <p className="text-sm text-gray-600">Adicione itens para acompanhar o progresso</p>
            </div>
        )
    }

    return (
        <div className="space-y-3 mt-6">
            {deliverables.map((item) => (
                <div
                    key={item.id}
                    className={`group flex items-center justify-between p-5 border rounded-xl transition-all duration-200 ${item.status === 'posted'
                        ? 'bg-green-900/10 border-green-900/30'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-5">
                        <Checkbox
                            checked={item.status === 'posted'}
                            onCheckedChange={() => toggleStatus(item.id, item.status)}
                            disabled={loadingId === item.id}
                            className="w-6 h-6 border-2 border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 rounded-md transition-all"
                        />

                        <div className="flex flex-col">
                            <p className={`font-semibold text-lg capitalize transition-colors ${item.status === 'posted' ? 'text-green-400 line-through opacity-70' : 'text-white'}`}>
                                {typeLabels[item.type] || item.type || 'Item sem nome'}
                            </p>
                            <p className="text-sm text-gray-400 font-medium mt-0.5">
                                Prazo: {formatDate(item.due_date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {item.status === 'posted' ? (
                            <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30 border-0">Feito</Badge>
                        ) : (
                            <Badge variant="outline" className="text-yellow-500 border-yellow-600/50 bg-yellow-900/10">
                                Pendente
                            </Badge>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
                                <DropdownMenuItem
                                    className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
                                    onClick={() => deleteItem(item.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}
        </div>
    )
}