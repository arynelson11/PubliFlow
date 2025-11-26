'use client'

import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Badge } from '@/components/ui/badge'
import { EditIdeaDialog } from '@/components/ui/edit-idea-dialog'

interface Idea {
    id: string
    title: string
    description: string | null
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    status: 'idea' | 'scripting' | 'filming' | 'done'
    priority: 'low' | 'medium' | 'high'
    created_at: string
}

interface IdeaCardProps {
    idea: Idea
    index: number
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

export function IdeaCard({ idea, index }: IdeaCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const priorityInfo = priorityConfig[idea.priority]

    return (
        <>
            <Draggable draggableId={idea.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setDialogOpen(true)}
                        className={`bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 cursor-pointer group transition-all duration-200
                            ${snapshot.isDragging ? 'shadow-2xl shadow-violet-500/40 border-violet-500 rotate-2' : 'hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20'}
                        `}
                    >
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
                )}
            </Draggable>

            <EditIdeaDialog
                idea={idea}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    )
}
