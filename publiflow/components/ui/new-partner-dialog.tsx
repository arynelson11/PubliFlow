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

export function NewPartnerDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [niche, setNiche] = useState('')
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const nome = formData.get('nome') as string
        const contato = formData.get('contato') as string

        // Pega o usuário atual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('Você precisa estar logado')
            setLoading(false)
            return
        }

        // --- AQUI ESTAVA O PROBLEMA, AGORA ESTÁ CORRIGIDO ---
        const { error } = await supabase.from('partners').insert({
            name: nome,              // O Banco pede 'name'
            contact_info: contato,   // O Banco pede 'contact_info'
            niche: niche,            // O Banco pede 'niche' (em inglês)
            user_id: user.id
        })
        // ----------------------------------------------------

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh() // Atualiza a lista
        } else {
            console.error('Erro ao criar parceiro:', error)
            alert('Erro ao criar parceiro: ' + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Nova Parceria</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Adicionar Parceiro</DialogTitle>
                        <DialogDescription>
                            Cadastre uma nova loja ou marca para gerenciar acordos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right">
                                Nome
                            </Label>
                            <Input id="nome" name="nome" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contato" className="text-right">
                                Contato
                            </Label>
                            <Input id="contato" name="contato" placeholder="WhatsApp ou Email" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="niche" className="text-right">
                                Nicho
                            </Label>
                            <Select value={niche} onValueChange={setNiche}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Moda">Moda</SelectItem>
                                    <SelectItem value="Beleza">Beleza</SelectItem>
                                    <SelectItem value="Tech">Tech</SelectItem>
                                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                                    <SelectItem value="Outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Parceiro'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}