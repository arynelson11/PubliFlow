import Link from 'next/link'
import { LayoutDashboard, Handshake, Users, LogOut, Zap, Wallet, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-950">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <Link href="/dashboard" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-1.5 rounded-lg flex items-center justify-center">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span>PubliFlow</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
                        Dashboard
                    </NavLink>
                    <NavLink href="/deals" icon={<Handshake className="h-5 w-5" />}>
                        Meus Acordos
                    </NavLink>
                    <NavLink href="/partners" icon={<Users className="h-5 w-5" />}>
                        Parceiros
                    </NavLink>
                    <NavLink href="/finance" icon={<Wallet className="h-5 w-5" />}>
                        Financeiro
                    </NavLink>
                    <NavLink href="/calendar" icon={<Calendar className="h-5 w-5" />}>
                        Calendário
                    </NavLink>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-800">
                    <div className="mb-3 text-sm text-gray-400 truncate">
                        {user.email}
                    </div>
                    <form action={signOut}>
                        <Button
                            type="submit"
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Sair
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-500 hover:text-white transition-all font-medium group"
        >
            <span className="group-hover:scale-110 transition-transform">
                {icon}
            </span>
            {children}
        </Link>
    )
}
