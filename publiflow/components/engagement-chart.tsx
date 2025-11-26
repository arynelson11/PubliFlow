'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for demonstration
const data = [
    { month: 'Jun', engajamento: 4200 },
    { month: 'Jul', engajamento: 5800 },
    { month: 'Ago', engajamento: 6500 },
    { month: 'Set', engajamento: 7200 },
    { month: 'Out', engajamento: 8900 },
    { month: 'Nov', engajamento: 10500 },
]

export function EngagementChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f3f4f6'
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                />
                <Line
                    type="monotone"
                    dataKey="engajamento"
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 5 }}
                    activeDot={{ r: 7 }}
                />
                <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </LineChart>
        </ResponsiveContainer>
    )
}
