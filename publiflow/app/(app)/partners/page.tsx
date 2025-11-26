import { createClient } from '@/lib/supabase/server'
import { NewPartnerDialog } from '@/components/ui/new-partner-dialog'
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
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Meus Parceiros</h1>
                    <p className="text-gray-400">Gerencie seus parceiros e contatos</p>
                </div>
                <NewPartnerDialog />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50 border-b border-gray-800">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-300">Nome da Loja</th>
                            <th className="p-4 text-left font-medium text-gray-300">Nicho</th>
                            <th className="p-4 text-left font-medium text-gray-300">Contato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-gray-500 text-lg">Nenhum parceiro cadastrado</div>
                                        <p className="text-gray-600 text-sm">Clique em "Nova Parceria" para começar</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            partners?.map((partner) => (
                                <tr key={partner.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-medium text-gray-200">{partner.name}</td>
                                    <td className="p-4 text-gray-300 capitalize">{partner.niche || '-'}</td>
                                    <td className="p-4 text-gray-300">{partner.contact_info || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}