'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Atualiza o status de uma ideia (usado pelo drag-and-drop)
 */
export async function updateIdeaStatus(id: string, newStatus: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('ideas')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Error updating idea status:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/ideas')
        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Erro inesperado ao atualizar status' }
    }
}

/**
 * Atualiza todos os detalhes de uma ideia (usado pelo modal de edição)
 */
export async function updateIdea(formData: FormData) {
    try {
        const supabase = await createClient()

        const id = formData.get('id') as string
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const platform = formData.get('platform') as string
        const priority = formData.get('priority') as string
        const status = formData.get('status') as string

        const { error } = await supabase
            .from('ideas')
            .update({
                title,
                description,
                platform,
                priority,
                status
            })
            .eq('id', id)

        if (error) {
            console.error('Error updating idea:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/ideas')
        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Erro inesperado ao atualizar ideia' }
    }
}

/**
 * Exclui uma ideia (usado pelo botão de exclusão no modal)
 */
export async function deleteIdea(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('ideas')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting idea:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/ideas')
        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Erro inesperado ao excluir ideia' }
    }
}

/**
 * Sincroniza deliverables pendentes com Google Calendar
 */
/**
 * Sincroniza deliverables pendentes com Google Calendar
 */
export async function syncToGoogleCalendar() {
    try {
        const supabase = await createClient()

        // 1. Obter a sessão do usuário
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
            return { success: false, error: 'Sessão não encontrada. Faça login novamente.' }
        }

        // 2. Extrair o provider_token (token do Google)
        let providerToken = session.provider_token
        const providerRefreshToken = session.provider_refresh_token

        if (!providerToken) {
            return {
                success: false,
                error: 'Token do Google não encontrado. Faça login novamente com Google para conceder permissões ao calendário.'
            }
        }

        // Função auxiliar para tentar fazer a requisição ao Google
        const fetchGoogleCalendar = async (token: string, event: any) => {
            return await fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                }
            )
        }

        // Função para renovar o token
        const refreshGoogleToken = async (refreshToken: string) => {
            const clientId = process.env.SUPABASE_AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
            const clientSecret = process.env.SUPABASE_AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET

            if (!clientId || !clientSecret) {
                console.error('Google Client ID or Secret not found in environment variables')
                return null
            }

            try {
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        refresh_token: refreshToken,
                        grant_type: 'refresh_token',
                    }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    console.error('Error refreshing token:', error)
                    return null
                }

                const data = await response.json()
                return data.access_token as string
            } catch (error) {
                console.error('Error refreshing token:', error)
                return null
            }
        }

        // 3. Buscar deliverables pendentes que ainda não foram sincronizados
        const { data: deliverables, error: deliverableError } = await supabase
            .from('deliverables')
            .select(`
                id,
                type,
                due_date,
                status,
                deal:deals (
                    notes,
                    partner:partners (
                        name
                    )
                )
            `)
            .eq('status', 'pending')
            .not('due_date', 'is', null)

        if (deliverableError) {
            console.error('Error fetching deliverables:', deliverableError)
            return { success: false, error: 'Erro ao buscar entregas' }
        }

        if (!deliverables || deliverables.length === 0) {
            return { success: true, message: 'Nenhuma entrega pendente para sincronizar', count: 0 }
        }

        // 4. Criar eventos no Google Calendar para cada deliverable
        let successCount = 0
        let errorCount = 0
        let tokenRefreshed = false

        for (const deliverable of deliverables) {
            try {
                const partnerName = (deliverable.deal as any)?.partner?.name || 'Parceiro'
                const notes = (deliverable.deal as any)?.notes || ''
                const typeLabels: Record<string, string> = {
                    story: 'Story',
                    reel: 'Reels',
                    feed: 'Feed',
                    tiktok: 'TikTok'
                }
                const typeLabel = typeLabels[deliverable.type] || deliverable.type

                // Formatar data para o Google Calendar (formato ISO)
                const dueDate = new Date(deliverable.due_date)
                const dateString = dueDate.toISOString().split('T')[0] // YYYY-MM-DD

                const event = {
                    summary: `PubliFlow: ${typeLabel} para ${partnerName}`,
                    description: `Entrega de conteúdo\nTipo: ${typeLabel}\nParceiro: ${partnerName}\n${notes ? `Notas: ${notes}` : ''}`,
                    start: {
                        date: dateString,
                    },
                    end: {
                        date: dateString,
                    },
                    colorId: '9', // Azul no Google Calendar
                }

                // Tentar criar evento com o token atual
                let response = await fetchGoogleCalendar(providerToken, event)

                // Se falhar com 401 (Unauthorized) e tivermos refresh token, tentar renovar
                if (response.status === 401 && providerRefreshToken && !tokenRefreshed) {
                    console.log('Token expirado, tentando renovar...')
                    const newToken = await refreshGoogleToken(providerRefreshToken)

                    if (newToken) {
                        providerToken = newToken
                        tokenRefreshed = true
                        // Tentar novamente com o novo token
                        response = await fetchGoogleCalendar(providerToken, event)
                    }
                }

                if (response.ok) {
                    successCount++
                } else {
                    const errorData = await response.json()
                    console.error('Error creating event:', errorData)
                    errorCount++
                }
            } catch (eventError) {
                console.error('Error processing deliverable:', eventError)
                errorCount++
            }
        }

        revalidatePath('/calendar')

        if (errorCount === 0) {
            return {
                success: true,
                message: `${successCount} entrega(s) sincronizada(s) com sucesso!`,
                count: successCount
            }
        } else {
            return {
                success: true,
                message: `${successCount} sincronizada(s), ${errorCount} com erro`,
                count: successCount
            }
        }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Erro inesperado ao sincronizar com Google Calendar' }
    }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateProfile(formData: FormData) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Usuário não autenticado' }
        }

        const fullName = formData.get('fullName') as string
        const bio = formData.get('bio') as string
        const avatarUrl = formData.get('avatarUrl') as string

        const updates: any = {
            updated_at: new Date().toISOString(),
        }

        if (fullName !== null) updates.full_name = fullName
        if (bio !== null) updates.bio = bio
        if (avatarUrl !== null) updates.avatar_url = avatarUrl

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

        if (error) {
            console.error('Error updating profile:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/settings')
        revalidatePath('/dashboard') // Atualizar avatar no header/sidebar se houver
        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Erro inesperado ao atualizar perfil' }
    }
}
