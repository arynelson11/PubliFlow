import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SettingsForm } from '@/components/settings-form'
import { Settings, Sliders } from 'lucide-react'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
                <p className="text-gray-400">Gerencie seu perfil e preferências</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-gray-900 border border-gray-800 p-1 rounded-xl mb-8">
                    <TabsTrigger
                        value="profile"
                        className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 rounded-lg px-6 py-2.5 flex items-center gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger
                        value="preferences"
                        className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 rounded-lg px-6 py-2.5 flex items-center gap-2"
                    >
                        <Sliders className="h-4 w-4" />
                        Preferências
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                        <SettingsForm user={user} profile={profile} />
                    </div>
                </TabsContent>

                <TabsContent value="preferences">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                            <Sliders className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Em breve</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Estamos trabalhando em novas opções de personalização para você.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
