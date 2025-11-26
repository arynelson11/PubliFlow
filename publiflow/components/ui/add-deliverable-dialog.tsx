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
import { Plus } from 'lucide-react'

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
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Entrega</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Adicione um novo item à lista de entregas deste acordo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300">Tipo</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="story" className="focus:bg-gray-700 focus:text-white">Story</SelectItem>
                                    <SelectItem value="reel" className="focus:bg-gray-700 focus:text-white">Reels</SelectItem>
                                    <SelectItem value="feed" className="focus:bg-gray-700 focus:text-white">Post no Feed</SelectItem>
                                    <SelectItem value="tiktok" className="focus:bg-gray-700 focus:text-white">TikTok</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right text-gray-300">Data Limite</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-md border-0"
                        >
                            {loading ? 'Salvando...' : 'Salvar Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}