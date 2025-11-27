import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SettingsForm } from '@/components/settings-form'
import { Settings, Sliders, Bell, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const hasGoogleToken = !!session?.provider_token

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

                <TabsContent value="preferences" className="space-y-6">
                    {/* Notificações */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <Bell className="h-5 w-5 text-violet-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Notificações</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-gray-200">Alertas de Prazo por E-mail</Label>
                                    <p className="text-sm text-gray-400">Receba avisos quando uma entrega estiver próxima.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-gray-200">Resumo Semanal</Label>
                                    <p className="text-sm text-gray-400">Um email toda segunda-feira com suas tarefas da semana.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>

                    {/* Integrações */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <Calendar className="h-5 w-5 text-fuchsia-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Integrações</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Google Calendar</p>
                                    <p className="text-sm text-gray-400">Sincronize suas entregas automaticamente.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {hasGoogleToken ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        Conectado
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                        <XCircle className="h-3.5 w-3.5" />
                                        Desconectado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
