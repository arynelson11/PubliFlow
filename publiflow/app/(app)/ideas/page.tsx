import { createClient } from '@/lib/supabase/server'
import { NewIdeaDialog } from '@/components/ui/new-idea-dialog'
import { Lightbulb, Sparkles, Edit3, Film, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Idea {
    id: string
    title: string
    description: string | null
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    status: 'idea' | 'scripting' | 'filming' | 'done'
    priority: 'low' | 'medium' | 'high'
    created_at: string
}

export default async function IdeasPage() {
    const supabase = await createClient()

    // Fetch all ideas
    const { data: ideas } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

    // Organize ideas by status
    const ideaIdeas = ideas?.filter(i => i.status === 'idea') || []
    const scriptingIdeas = ideas?.filter(i => i.status === 'scripting') || []
    const filmingIdeas = ideas?.filter(i => i.status === 'filming') || []
    const doneIdeas = ideas?.filter(i => i.status === 'done') || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Lightbulb className="h-8 w-8 text-yellow-400" />
                        Ideias de Conteúdo
                    </h1>
                    <p className="text-gray-400">Organize suas ideias de conteúdo em um quadro Kanban</p>
                </div>
                <NewIdeaDialog />
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Coluna Ideia */}
                <KanbanColumn
                    title="💡 Ideia"
                    color="from-gray-600 to-gray-700"
                    ideas={ideaIdeas}
                    icon={<Sparkles className="h-5 w-5" />}
                />

                {/* Coluna Roteirizando */}
                <KanbanColumn
                    title="📝 Roteirizando"
                    color="from-blue-600 to-blue-700"
                    ideas={scriptingIdeas}
                    icon={<Edit3 className="h-5 w-5" />}
                />

                {/* Coluna Filmando */}
                <KanbanColumn
                    title="🎬 Filmando"
                    color="from-amber-600 to-amber-700"
                    ideas={filmingIdeas}
                    icon={<Film className="h-5 w-5" />}
                />

                {/* Coluna Pronto */}
                <KanbanColumn
                    title="✅ Pronto"
                    color="from-green-600 to-green-700"
                    ideas={doneIdeas}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                />
            </div>

            {/* Empty State */}
            {!ideas?.length && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                    <Lightbulb className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma ideia cadastrada</h3>
                    <p className="text-gray-500 mb-6">Comece adicionando sua primeira ideia de conteúdo!</p>
                    <NewIdeaDialog />
                </div>
            )}
        </div>
    )
}

function KanbanColumn({
    title,
    color,
    ideas,
    icon
}: {
    title: string
    color: string
    ideas: Idea[]
    icon: React.ReactNode
}) {
    return (
        <div className="flex flex-col">
            {/* Column Header */}
            <div className={`bg-gradient-to-br ${color} rounded-t-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        {icon}
                        {title}
                    </h3>
                    <span className="bg-white/20 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
                        {ideas.length}
                    </span>
                </div>
            </div>

            {/* Column Content */}
            <div className="bg-gray-900 border border-gray-800 border-t-0 rounded-b-xl p-4 min-h-[400px] space-y-3">
                {ideas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} />
                ))}
                {ideas.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                        Nenhuma ideia aqui
                    </div>
                )}
            </div>
        </div>
    )
}

const platformEmojis = {
    Instagram: '📸',
    TikTok: '🎵',
    YouTube: '🎥'
}

const priorityConfig = {
    low: { emoji: '🟢', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    medium: { emoji: '🟡', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    high: { emoji: '🔴', color: 'bg-red-500/10 text-red-400 border-red-500/30' }
}

function IdeaCard({ idea }: { idea: Idea }) {
    const priorityInfo = priorityConfig[idea.priority]

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-violet-500 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-violet-500/20">
            <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-white group-hover:text-violet-400 transition-colors flex-1">
                    {idea.title}
                </h4>
                <span className="text-lg ml-2">{platformEmojis[idea.platform]}</span>
            </div>

            {idea.description && (
                <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                    {idea.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-semibold px-2 py-0.5 border ${priorityInfo.color}`}>
                        {priorityInfo.emoji} {idea.priority === 'low' ? 'Baixa' : idea.priority === 'medium' ? 'Média' : 'Alta'}
                    </Badge>
                </div>
                <div className="text-xs text-gray-500">
                    {new Date(idea.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                    })}
                </div>
            </div>
        </div>
    )
}
