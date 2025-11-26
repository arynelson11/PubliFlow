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
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function NewIdeaDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('idea')
    const [platform, setPlatform] = useState('')
    const [priority, setPriority] = useState('medium')

    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title')
        const description = formData.get('description')

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase.from('ideas').insert({
            title,
            description,
            platform,
            status,
            priority,
            user_id: user.id
        })

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh()
            // Reseta o formulário
            e.currentTarget.reset()
            setStatus('idea')
            setPlatform('')
            setPriority('medium')
        } else {
            console.error(error)
            alert('Erro ao criar ideia: ' + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Ideia
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Ideia</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Cadastre uma nova ideia de conteúdo para organizar seu planejamento.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right text-gray-300 font-medium">Título</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ex: Review de produto X"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 h-10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-gray-300 font-medium">Descrição</Label>
                            <Textarea
                                id="description"
                                name="description"
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 placeholder:text-gray-500 min-h-[100px]"
                                placeholder="Descreva sua ideia de conteúdo..."
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Plataforma</Label>
                            <Select onValueChange={setPlatform} required>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Selecione a plataforma..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="Instagram" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        📸 Instagram
                                    </SelectItem>
                                    <SelectItem value="TikTok" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        🎵 TikTok
                                    </SelectItem>
                                    <SelectItem value="YouTube" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        🎥 YouTube
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Status</Label>
                            <Select onValueChange={setStatus} defaultValue="idea">
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Selecione o status..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="idea" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        💡 Ideia
                                    </SelectItem>
                                    <SelectItem value="scripting" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        📝 Roteirizando
                                    </SelectItem>
                                    <SelectItem value="filming" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        🎬 Filmando
                                    </SelectItem>
                                    <SelectItem value="done" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        ✅ Pronto
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Prioridade</Label>
                            <Select onValueChange={setPriority} defaultValue="medium">
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-violet-600 focus:border-violet-600 h-10">
                                    <SelectValue placeholder="Selecione a prioridade..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="low" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        🟢 Baixa
                                    </SelectItem>
                                    <SelectItem value="medium" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        🟡 Média
                                    </SelectItem>
                                    <SelectItem value="high" className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                        🔴 Alta
                                    </SelectItem>
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
                            {loading ? 'Salvando...' : 'Salvar Ideia'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
