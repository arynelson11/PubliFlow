'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

export function ShareButton({ dealId }: { dealId: string }) {
    const [copied, setCopied] = useState(false)

    async function copyLink() {
        const url = `${window.location.origin}/report/${dealId}`

        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Erro ao copiar:', error)
            alert('Erro ao copiar link')
        }
    }

    return (
        <Button
            onClick={copyLink}
            variant="outline"
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Link Copiado!
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4" />
                    Compartilhar Relatório
                </>
            )}
        </Button>
    )
}
