import { createClient } from '@/lib/supabase/server'
import { NewIdeaDialog } from '@/components/ui/new-idea-dialog'
import { KanbanBoard } from '@/components/kanban-board'
import { Lightbulb } from 'lucide-react'

export default async function IdeasPage() {
    const supabase = await createClient()

    // Fetch all ideas
    const { data: ideas } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Lightbulb className="h-8 w-8 text-yellow-400" />
                        Ideias de Conteúdo
                    </h1>
                    <p className="text-gray-400">Arraste os cards para mudar o status, clique para editar</p>
                </div>
                <NewIdeaDialog />
            </div>

            <KanbanBoard initialIdeas={ideas || []} />
        </div>
    )
}
