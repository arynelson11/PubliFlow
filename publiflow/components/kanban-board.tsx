'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { IdeaCard } from '@/components/idea-card'
import { updateIdeaStatus } from '@/app/actions'
import { Sparkles, Edit3, Film, CheckCircle2, Lightbulb } from 'lucide-react'
import { NewIdeaDialog } from '@/components/ui/new-idea-dialog'

interface Idea {
    id: string
    title: string
    description: string | null
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    status: 'idea' | 'scripting' | 'filming' | 'done'
    priority: 'low' | 'medium' | 'high'
    created_at: string
}

interface KanbanBoardProps {
    initialIdeas: Idea[]
}

interface Column {
    id: string
    title: string
    status: 'idea' | 'scripting' | 'filming' | 'done'
    color: string
    icon: React.ReactNode
}

const columns: Column[] = [
    {
        id: 'idea',
        title: '💡 Ideia',
        status: 'idea',
        color: 'from-gray-600 to-gray-700',
        icon: <Sparkles className="h-5 w-5" />
    },
    {
        id: 'scripting',
        title: '📝 Roteirizando',
        status: 'scripting',
        color: 'from-blue-600 to-blue-700',
        icon: <Edit3 className="h-5 w-5" />
    },
    {
        id: 'filming',
        title: '🎬 Filmando',
        status: 'filming',
        color: 'from-amber-600 to-amber-700',
        icon: <Film className="h-5 w-5" />
    },
    {
        id: 'done',
        title: '✅ Pronto',
        status: 'done',
        color: 'from-green-600 to-green-700',
        icon: <CheckCircle2 className="h-5 w-5" />
    }
]

export function KanbanBoard({ initialIdeas }: KanbanBoardProps) {
    const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)

    // Sync with server updates
    useEffect(() => {
        setIdeas(initialIdeas)
    }, [initialIdeas])

    // Organize ideas by status
    const getIdeasByStatus = (status: string) => {
        return ideas.filter(idea => idea.status === status)
    }

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result

        // Dropped outside a valid droppable
        if (!destination) return

        // Dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return
        }

        const newStatus = destination.droppableId as Idea['status']

        // Optimistic update
        setIdeas(prevIdeas =>
            prevIdeas.map(idea =>
                idea.id === draggableId ? { ...idea, status: newStatus } : idea
            )
        )

        // Update in database
        const result_update = await updateIdeaStatus(draggableId, newStatus)

        if (!result_update.success) {
            // Rollback on error
            setIdeas(initialIdeas)
            alert('Erro ao atualizar status: ' + (result_update.error || 'Erro desconhecido'))
        }
    }

    // Empty state
    if (ideas.length === 0) {
        return (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                <Lightbulb className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma ideia cadastrada</h3>
                <p className="text-gray-500 mb-6">Comece adicionando sua primeira ideia de conteúdo!</p>
                <NewIdeaDialog />
            </div>
        )
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {columns.map(column => {
                    const columnIdeas = getIdeasByStatus(column.status)

                    return (
                        <div key={column.id} className="flex flex-col">
                            {/* Column Header */}
                            <div className={`bg-gradient-to-br ${column.color} rounded-t-xl p-4 shadow-lg`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                        {column.icon}
                                        {column.title}
                                    </h3>
                                    <span className="bg-white/20 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                        {columnIdeas.length}
                                    </span>
                                </div>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.status}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`bg-gray-900 border border-gray-800 border-t-0 rounded-b-xl p-4 min-h-[400px] transition-colors
                                            ${snapshot.isDraggingOver ? 'bg-gray-800/50 border-violet-500' : ''}
                                        `}
                                    >
                                        {columnIdeas.map((idea, index) => (
                                            <IdeaCard key={idea.id} idea={idea} index={index} />
                                        ))}
                                        {provided.placeholder}
                                        {columnIdeas.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                                                Nenhuma ideia aqui
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}
