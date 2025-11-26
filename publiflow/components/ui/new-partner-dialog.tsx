'use client'

import { useState } from 'react'
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

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('Você precisa estar logado')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('partners').insert({
            name: nome,
            contact_info: contato,
            niche: niche,
            user_id: user.id
        })

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh()
        } else {
            console.error('Erro ao criar parceiro:', error)
            alert('Erro ao criar parceiro: ' + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Parceria
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Parceiro</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Cadastre uma nova loja ou marca para gerenciar acordos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right text-gray-300 font-medium">
                                Nome
                            </Label>
                            <Input
                                id="nome"
                                name="nome"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
                                placeholder="Nome da Loja ou Marca"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contato" className="text-right text-gray-300 font-medium">
                                Contato
                            </Label>
                            <Input
                                id="contato"
                                name="contato"
                                placeholder="WhatsApp ou Email"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="niche" className="text-right text-gray-300 font-medium">
                                Nicho
                            </Label>
                            <Select value={niche} onValueChange={setNiche}>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Selecione o nicho..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="Moda" className="focus:bg-gray-700 focus:text-white cursor-pointer">Moda</SelectItem>
                                    <SelectItem value="Beleza" className="focus:bg-gray-700 focus:text-white cursor-pointer">Beleza</SelectItem>
                                    <SelectItem value="Tech" className="focus:bg-gray-700 focus:text-white cursor-pointer">Tech</SelectItem>
                                    <SelectItem value="Alimentação" className="focus:bg-gray-700 focus:text-white cursor-pointer">Alimentação</SelectItem>
                                    <SelectItem value="Outros" className="focus:bg-gray-700 focus:text-white cursor-pointer">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-md border-0"
                        >
                            {loading ? 'Salvando...' : 'Salvar Parceiro'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}