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
