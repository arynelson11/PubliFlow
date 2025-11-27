import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import GoogleAuthButton from '@/components/google-auth-button'

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

                        <div className="w-full">
                            <GoogleAuthButton />
                        </div>
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
            </div>

            {searchParams?.message && (
                <p className="mt-4 p-4 bg-red-800 text-white text-center rounded-lg text-sm max-w-md w-full">
                    {searchParams.message}
                </p>
            )}

            <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg max-w-md text-center">
                <p className="text-sm text-gray-400">
                    Teste grátis por 7 dias. Cancele quando quiser.
                </p>
            </div>
        </div>
    )
}