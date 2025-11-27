import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkSubscription() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, trial_ends_at')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return null
    }

    const now = new Date()
    const trialEndsAt = new Date(profile.trial_ends_at)
    const isActive = profile.subscription_status === 'active'
    const isTrialing = profile.subscription_status === 'trial'

    // Se não estiver ativo e (estiver em trial E o trial acabou) OU (status for cancelado/past_due)
    const isExpired = !isActive && ((isTrialing && now > trialEndsAt) || ['canceled', 'past_due'].includes(profile.subscription_status))

    return {
        isExpired,
        subscriptionStatus: profile.subscription_status,
        trialEndsAt: profile.trial_ends_at
    }
}
