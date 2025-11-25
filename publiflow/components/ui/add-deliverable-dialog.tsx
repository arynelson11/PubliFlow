'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function AddDeliverableDialog({ dealId }: { dealId: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState('story') // Valor padrão
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const date = formData.get('date') as string

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // --- CORREÇÃO AQUI (due_date) ---
        const { error } = await supabase.from('deliverables').insert({
            deal_id: dealId,
            type: type,             // 'type' no banco
            due_date: date,         // 'due_date' no banco (era data_limite)
            status: 'pending',
            user_id: user.id
        })
        // -------------------------------

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh()
        } else {
            alert('Erro ao criar item: ' + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Adicionar Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Adicionar Entrega</DialogTitle>
                        <DialogDescription>
                            Adicione um novo item à lista de entregas deste acordo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Tipo</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="story">Story</SelectItem>
                                    <SelectItem value="reel">Reels</SelectItem>
                                    <SelectItem value="feed">Post no Feed</SelectItem>
                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Data Limite</Label>
                            <Input id="date" name="date" type="date" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}