import { createClient } from '@/lib/supabase/server'
import { NewPartnerDialog } from '@/components/ui/new-partner-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { redirect } from 'next/navigation'

export default async function PartnersPage() {
    const supabase = await createClient()

    // Verifica sessão
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Busca parceiros do banco
    const { data: partners } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Meus Parceiros</h1>
                <NewPartnerDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome da Loja</TableHead>
                            <TableHead>Nicho</TableHead>
                            <TableHead>Contato</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {partners?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    Nenhum parceiro encontrado. Adicione o primeiro!
                                </TableCell>
                            </TableRow>
                        ) : (
                            partners?.map((partner) => (
                                <TableRow key={partner.id}>
                                    <TableCell className="font-medium">{partner.nome}</TableCell>
                                    <TableCell>{partner.nicho || '-'}</TableCell>
                                    <TableCell>{partner.contact_info || '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}