import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { message: string; tab: string }
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        return redirect('/dashboard')
    }

    const defaultTab = searchParams.tab === 'register' ? 'register' : 'login'

    const signIn = async (formData: FormData) => {
        'use server'
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return redirect('/login?message=Não foi possível fazer login. Tente novamente.&tab=login')
        }

        return redirect('/dashboard')
    }

    const signUp = async (formData: FormData) => {
        'use server'
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        })

        if (error) {
            return redirect('/login?message=Não foi possível cadastrar. Verifique seu e-mail e senha.&tab=register')
        }

        return redirect('/login?message=Verifique seu e-mail para confirmar seu cadastro.')
    }

    const signInWithGoogle = async () => {
        'use server'
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        })

        if (error) {
            return redirect('/login?message=Erro ao fazer login com Google.&tab=login')
        }

        if (data.url) {
            return redirect(data.url)
        }
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gray-950 text-white p-4">
            <Link href="/">
                <div className="flex items-center gap-2 font-black text-3xl tracking-tighter mb-10 text-white">
                    <div className="bg-violet-600 text-white p-2 rounded-lg flex items-center justify-center">
                        <Zap className="h-7 w-7 fill-current" />
                    </div>
                    <span>PubliFlow</span>
                </div>
            </Link>

            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-xl mb-6">
                        <TabsTrigger
                            value="login"
                            className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl font-semibold"
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl font-semibold"
                        >
                            Cadastro
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="space-y-6">
                        <form action={signIn} className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="email" className="text-gray-300 mb-2 block">E-mail</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-600 rounded-lg h-12 px-4"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-gray-300 mb-2 block">Senha</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-600 rounded-lg h-12 px-4"
                                    placeholder="••••••••"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold py-3 rounded-lg text-lg transition-all h-12"
                            >
                                Entrar
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">ou</span>
                            </div>
                        </div>

                        <form action={signInWithGoogle}>
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-300 font-semibold py-3 rounded-lg text-lg transition-all h-12 flex items-center justify-center gap-3 shadow-lg"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continuar com Google
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="register" className="space-y-6">
                        <form action={signUp} className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="email-register" className="text-gray-300 mb-2 block">E-mail</Label>
                                <Input
                                    id="email-register"
                                    name="email"
                                    type="email"
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-600 rounded-lg h-12 px-4"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password-register" className="text-gray-300 mb-2 block">Senha</Label>
                                <Input
                                    id="password-register"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-600 rounded-lg h-12 px-4"
                                    placeholder="Crie uma senha forte"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold py-3 rounded-lg text-lg transition-all h-12"
                            >
                                Cadastrar
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-red-800 text-white text-center rounded-lg text-sm">
                        {searchParams.message}
                    </p>
                )}
            </div>

            <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg max-w-md text-center">
                <p className="text-sm text-gray-400">
                    ℹ️ Para ativar o Google OAuth, configure no Supabase Dashboard e adicione as credenciais em <code className="text-violet-400">.env.local</code>
                </p>
            </div>
        </div>
    )
}