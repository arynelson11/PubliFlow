'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DayPicker } from 'react-day-picker'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Deliverable = {
    id: string
    type: string
    due_date: string
    status: string
    deal_id: string
    deal: {
        partner: {
            name: string
        }
    }
}

const typeLabels: Record<string, string> = {
    story: '📸 Story',
    reel: '🎬 Reels',
    feed: '🖼️ Feed',
    tiktok: '🎵 TikTok'
}

export default function CalendarPage() {
    const [deliverables, setDeliverables] = useState<Deliverable[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchDeliverables()
    }, [])

    async function fetchDeliverables() {
        const { data } = await supabase
            .from('deliverables')
            .select(`
                id,
                type,
                due_date,
                status,
                deal_id,
                deal:deals (
                    partner:partners (
                        name
                    )
                )
            `)
            .order('due_date', { ascending: true })

        if (data) {
            setDeliverables(data as any)
        }
        setLoading(false)
    }

    // Get dates that have deliverables
    const datesWithDeliverables = deliverables.map(d => new Date(d.due_date))

    // Get deliverables for selected date
    const selectedDeliverables = selectedDate
        ? deliverables.filter(d => {
            const dueDate = new Date(d.due_date)
            return dueDate.toDateString() === selectedDate.toDateString()
        })
        : []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Calendário de Conteúdo</h1>
                <p className="text-gray-400">Visualize suas entregas agendadas por mês.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Calendar */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Mês Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <style jsx global>{`
                            .rdp {
                                --rdp-cell-size: 45px;
                                --rdp-accent-color: #a855f7;
                                --rdp-background-color: #1f2937;
                                margin: 0;
                            }
                            .rdp-months {
                                justify-content: center;
                            }
                            .rdp-month {
                                color: #fff;
                            }
                            .rdp-caption {
                                color: #fff;
                                font-weight: 600;
                                margin-bottom: 1rem;
                            }
                            .rdp-head_cell {
                                color: #9ca3af;
                                font-weight: 500;
                                font-size: 0.875rem;
                            }
                            .rdp-cell {
                                padding: 2px;
                            }
                            .rdp-day {
                                color: #d1d5db;
                                border-radius: 0.5rem;
                                font-weight: 500;
                            }
                            .rdp-day:hover:not(.rdp-day_selected) {
                                background-color: #374151;
                            }
                            .rdp-day_selected {
                                background: linear-gradient(to right, #a855f7, #d946ef);
                                color: white;
                                font-weight: 600;
                            }
                            .rdp-day_today:not(.rdp-day_selected) {
                                color: #a855f7;
                                font-weight: 700;
                            }
                            .rdp-day_outside {
                                color: #4b5563;
                            }
                            .rdp-button:disabled {
                                opacity: 0.3;
                            }
                            .day-with-deliverable {
                                position: relative;
                            }
                            .day-with-deliverable::after {
                                content: '';
                                position: absolute;
                                bottom: 4px;
                                left: 50%;
                                transform: translateX(-50%);
                                width: 6px;
                                height: 6px;
                                background-color: #10b981;
                                border-radius: 50%;
                            }
                        `}</style>
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={ptBR}
                            modifiers={{
                                hasDeliverable: datesWithDeliverables
                            }}
                            modifiersClassNames={{
                                hasDeliverable: 'day-with-deliverable'
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Selected Day Details */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">
                            {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: ptBR }) : 'Selecione um dia'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-gray-400 text-center py-8">Carregando...</p>
                        ) : selectedDeliverables.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">
                                Nenhuma entrega agendada para este dia.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {selectedDeliverables.map((deliverable) => (
                                    <Link
                                        key={deliverable.id}
                                        href={`/deals/${deliverable.deal_id}`}
                                        className="block"
                                    >
                                        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-violet-600 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-lg font-semibold text-white">
                                                    {typeLabels[deliverable.type] || deliverable.type}
                                                </span>
                                                <Badge
                                                    className={
                                                        deliverable.status === 'posted'
                                                            ? 'bg-green-600/20 text-green-400 border-0'
                                                            : 'bg-yellow-600/20 text-yellow-400 border-0'
                                                    }
                                                >
                                                    {deliverable.status === 'posted' ? 'Feito' : 'Pendente'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {deliverable.deal?.partner?.name || 'Parceiro não encontrado'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
