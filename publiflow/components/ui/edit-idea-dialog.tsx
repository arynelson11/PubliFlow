'use client'

import { useState } from 'react'
import { updateIdea, deleteIdea } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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

interface Idea {
    id: string
    title: string
    description: string | null
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    status: 'idea' | 'scripting' | 'filming' | 'done'
    priority: 'low' | 'medium' | 'high'
    created_at: string
}

interface EditIdeaDialogProps {
    idea: Idea
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditIdeaDialog({ idea, open, onOpenChange }: EditIdeaDialogProps) {
    const [loading, setLoading] = useState(false)
    const [platform, setPlatform] = useState(idea.platform)
    const [priority, setPriority] = useState(idea.priority)
    const [status, setStatus] = useState(idea.status)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append('id', idea.id)
        formData.append('platform', platform)
        formData.append('priority', priority)
        formData.append('status', status)

        const result = await updateIdea(formData)

        setLoading(false)

        if (result.success) {
            onOpenChange(false)
        } else {
            alert('Erro ao atualizar ideia: ' + (result.error || 'Erro desconhecido'))
        }
    }

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir esta ideia? Esta ação não pode ser desfeita.')) {
            return
        }

        setLoading(true)
        const result = await deleteIdea(idea.id)
        setLoading(false)

        if (result.success) {
            onOpenChange(false)
        } else {
            alert('Erro ao excluir ideia: ' + (result.error || 'Erro desconhecido'))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Editar Ideia</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Modifique os detalhes da sua ideia de conteúdo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right text-gray-300 font-medium">Título</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={idea.title}
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 h-10"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-gray-300 font-medium">Descrição</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={idea.description || ''}
                                className="col-span-3 bg-gray-800 border-gray-700 text-white focus-visible:ring-violet-600 min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Plataforma</Label>
                            <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="Instagram" className="focus:bg-gray-700 cursor-pointer">
                                        📸 Instagram
                                    </SelectItem>
                                    <SelectItem value="TikTok" className="focus:bg-gray-700 cursor-pointer">
                                        🎵 TikTok
                                    </SelectItem>
                                    <SelectItem value="YouTube" className="focus:bg-gray-700 cursor-pointer">
                                        🎥 YouTube
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Status</Label>
                            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="idea" className="focus:bg-gray-700 cursor-pointer">
                                        💡 Ideia
                                    </SelectItem>
                                    <SelectItem value="scripting" className="focus:bg-gray-700 cursor-pointer">
                                        📝 Roteirizando
                                    </SelectItem>
                                    <SelectItem value="filming" className="focus:bg-gray-700 cursor-pointer">
                                        🎬 Filmando
                                    </SelectItem>
                                    <SelectItem value="done" className="focus:bg-gray-700 cursor-pointer">
                                        ✅ Pronto
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-300 font-medium">Prioridade</Label>
                            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="low" className="focus:bg-gray-700 cursor-pointer">
                                        🟢 Baixa
                                    </SelectItem>
                                    <SelectItem value="medium" className="focus:bg-gray-700 cursor-pointer">
                                        🟡 Média
                                    </SelectItem>
                                    <SelectItem value="high" className="focus:bg-gray-700 cursor-pointer">
                                        🔴 Alta
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
