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

export function NewExpenseDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState('')
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const description = formData.get('description') as string
        const amount = formData.get('amount') as string
        const date = formData.get('date') as string

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('Você precisa estar logado')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('expenses').insert({
            description,
            amount: Number(amount),
            category,
            date,
            user_id: user.id
        })

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh()
        } else {
            console.error('Erro ao criar despesa:', error)
            alert('Erro ao criar despesa: ' + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Despesa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Registrar Despesa</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Adicione uma nova despesa para controle financeiro.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-gray-300 font-medium">
                                Descrição
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
                                placeholder="Ex: Assinatura Adobe"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right text-gray-300 font-medium">
                                Valor (R$)
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right text-gray-300 font-medium">
                                Categoria
                            </Label>
                            <Select value={category} onValueChange={setCategory} required>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="Equipamento" className="focus:bg-gray-700 focus:text-white cursor-pointer">Equipamento</SelectItem>
                                    <SelectItem value="Transporte" className="focus:bg-gray-700 focus:text-white cursor-pointer">Transporte</SelectItem>
                                    <SelectItem value="Software" className="focus:bg-gray-700 focus:text-white cursor-pointer">Software</SelectItem>
                                    <SelectItem value="Outros" className="focus:bg-gray-700 focus:text-white cursor-pointer">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right text-gray-300 font-medium">
                                Data
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
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
                            {loading ? 'Salvando...' : 'Salvar Despesa'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
