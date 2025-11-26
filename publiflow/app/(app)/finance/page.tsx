import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewExpenseDialog } from '@/components/ui/new-expense-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'

export default async function FinancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Deals (Active + Completed) for Revenue
    const { data: deals } = await supabase
        .from('deals')
        .select('estimated_value')
        .in('status', ['active', 'completed'])
        .eq('user_id', user.id)

    // Fetch Expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    const totalRevenue = deals?.reduce((acc, deal) => acc + (Number(deal.estimated_value) || 0), 0) || 0
    const totalExpenses = expenses?.reduce((acc, expense) => acc + (Number(expense.amount) || 0), 0) || 0
    const netProfit = totalRevenue - totalExpenses

    async function deleteExpense(id: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('expenses').delete().eq('id', id)
        revalidatePath('/finance')
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
                    <p className="text-gray-400">Gerencie suas receitas, despesas e lucro.</p>
                </div>
                <NewExpenseDialog />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Recebido</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Acordos ativos e concluídos</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Gasto</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpenses)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Despesas registradas</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Lucro Líquido</CardTitle>
                        <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(netProfit)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Receita - Despesas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Expenses Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Últimas Despesas</h2>
                </div>
                <Table>
                    <TableHeader className="bg-gray-900/50">
                        <TableRow className="border-gray-800 hover:bg-gray-800/50">
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Categoria</TableHead>
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-gray-400 text-right">Valor</TableHead>
                            <TableHead className="text-gray-400 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!expenses || expenses.length === 0 ? (
                            <TableRow className="border-gray-800 hover:bg-gray-800/50">
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Nenhuma despesa registrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id} className="border-gray-800 hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-white">{expense.description}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                            {expense.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-right text-white font-medium">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <form action={deleteExpense.bind(null, expense.id)}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-900/20">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
