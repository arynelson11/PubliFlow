'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, subMonths, startOfYear, isAfter, parseISO, getMonth, getYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RevenueChartProps {
    deals: {
        estimated_value: number
        updated_at: string
        status: string
    }[]
}

export function RevenueChart({ deals }: RevenueChartProps) {
    const [period, setPeriod] = useState('6months')

    const data = useMemo(() => {
        const now = new Date()
        let startDate = subMonths(now, 6)

        if (period === 'year') {
            startDate = startOfYear(now)
        }

        // Filtrar deals fechados (won) dentro do período
        // Assumindo que 'won' ou 'closed' ou 'concluido' é o status. 
        // Se não tiver certeza, vou usar 'won' e 'active' para garantir que apareça algo se 'won' não existir.
        // Mas o pedido diz "Acordos Fechados". Vou assumir status='won'.
        const filteredDeals = deals.filter(deal => {
            const date = new Date(deal.updated_at)
            return isAfter(date, startDate) && (deal.status === 'won' || deal.status === 'concluido' || deal.status === 'closed')
        })

        // Agrupar por mês
        const monthlyData: Record<string, number> = {}

        // Inicializar meses com 0
        let currentDate = startDate
        while (currentDate <= now) {
            const monthKey = format(currentDate, 'MMM', { locale: ptBR })
            // Capitalizar primeira letra
            const formattedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1)
            if (!monthlyData[formattedMonth]) {
                monthlyData[formattedMonth] = 0
            }
            currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
        }

        filteredDeals.forEach(deal => {
            const date = new Date(deal.updated_at)
            const monthKey = format(date, 'MMM', { locale: ptBR })
            const formattedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1)

            if (monthlyData[formattedMonth] !== undefined) {
                monthlyData[formattedMonth] += Number(deal.estimated_value) || 0
            }
        })

        return Object.entries(monthlyData).map(([month, revenue]) => ({
            month,
            revenue
        }))
    }, [deals, period])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Faturamento x Mês</h2>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="6months">Últimos 6 meses</SelectItem>
                        <SelectItem value="year">Este Ano</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `R$ ${value / 1000}k`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#f3f4f6'
                            }}
                            formatter={(value: number) => [
                                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                                'Faturamento'
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
