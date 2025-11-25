'use client'

import { useState, useEffect } from 'react'
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

        // --- AQUI ESTÁ A CORREÇÃO (start_date) ---
        const { error } = await supabase.from('deals').insert({
            partner_id: selectedPartner,
            payment_type: paymentType,
            estimated_value: Number(valor),
            notes: descricao,
            start_date: new Date().toISOString(), // <--- CORRIGIDO
            status: 'active',
            user_id: user.id
        })
        // ----------------------------------------

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
                <Button>Novo Acordo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Adicionar Acordo</DialogTitle>
                        <DialogDescription>
                            Cadastre um novo acordo com um parceiro.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Parceiro</Label>
                            <Select onValueChange={setSelectedPartner} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {partners.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Pagamento</Label>
                            <Select onValueChange={setPaymentType} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Tipo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Permuta">Permuta</SelectItem>
                                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="Hibrido">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="valor" className="text-right">Valor (R$)</Label>
                            <Input id="valor" name="valor" type="number" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descricao" className="text-right">Descrição</Label>
                            <Textarea id="descricao" name="descricao" className="col-span-3" placeholder="Ex: 3 Stories e 1 Reel" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Acordo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}