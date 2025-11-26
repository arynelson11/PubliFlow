'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function NewDealDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [partners, setPartners] = useState<any[]>([])

    // States para os selects
    const [selectedPartner, setSelectedPartner] = useState('')
    const [paymentType, setPaymentType] = useState('')

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function fetchPartners() {
            const { data } = await supabase.from('partners').select('id, name')
            if (data) setPartners(data)
        }
        fetchPartners()
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const valor = formData.get('valor')
        const descricao = formData.get('descricao')

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase.from('deals').insert({
            partner_id: selectedPartner,
            payment_type: paymentType,
            estimated_value: Number(valor),
            notes: descricao,
            start_date: new Date().toISOString(),
            status: 'active',
            user_id: user.id
        })

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh()
        } else {
            console.error(error)
            alert('Erro ao criar acordo: ' + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Acordo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Acordo</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Cadastre um novo acordo com um parceiro.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Parceiro</Label>
                            <Select onValueChange={setSelectedPartner} required>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Selecione..." className="placeholder:text-gray-500" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    {partners.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="focus:bg-gray-700 focus:text-white cursor-pointer">{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Pagamento</Label>
                            <Select onValueChange={setPaymentType} required>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Tipo..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="Permuta" className="focus:bg-gray-700 focus:text-white cursor-pointer">Permuta</SelectItem>
                                    <SelectItem value="Dinheiro" className="focus:bg-gray-700 focus:text-white cursor-pointer">Dinheiro</SelectItem>
                                    <SelectItem value="Hibrido" className="focus:bg-gray-700 focus:text-white cursor-pointer">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="valor" className="text-right text-gray-300 font-medium">Valor (R$)</Label>
                            <Input
                                id="valor"
                                name="valor"
                                type="number"
                                placeholder="0,00"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descricao" className="text-right text-gray-300 font-medium">Descrição</Label>
                            <Textarea
                                id="descricao"
                                name="descricao"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 min-h-[100px]"
                                placeholder="Ex: 3 Stories, 1 Reel e 1 Foto no Feed..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-md border-0"
                        >
                            {loading ? 'Salvando...' : 'Salvar Acordo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}