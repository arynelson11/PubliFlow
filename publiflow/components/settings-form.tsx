'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/app/actions'
import { Loader2, Upload, User } from 'lucide-react'
import Image from 'next/image'

interface SettingsFormProps {
    user: any
    profile: any
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)
    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [bio, setBio] = useState(profile?.bio || '')
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const supabase = createClient()

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            setMessage(null)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Selecione uma imagem para fazer upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
            setAvatarUrl(data.publicUrl)
            setMessage({ type: 'success', text: 'Avatar atualizado com sucesso!' })
        } catch (error: any) {
            console.error('Error uploading avatar:', error)
            setMessage({ type: 'error', text: 'Erro ao fazer upload do avatar. Verifique se o bucket "avatars" existe e é público.' })
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData()
        formData.append('fullName', fullName)
        formData.append('bio', bio)
        if (avatarUrl) formData.append('avatarUrl', avatarUrl)

        const result = await updateProfile(formData)

        if (result.success) {
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        } else {
            setMessage({ type: 'error', text: 'Erro ao atualizar perfil: ' + result.error })
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-800' : 'bg-red-900/50 text-red-200 border border-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <Label className="text-lg font-semibold text-white">Foto de Perfil</Label>
                <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User className="h-12 w-12 text-gray-500" />
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors">
                            <Upload className="h-4 w-4" />
                            Alterar foto
                        </Label>
                        <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            JPG, GIF ou PNG. Máximo de 2MB.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-white">Nome Completo</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Seu nome"
                        className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-violet-600"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Conte um pouco sobre você..."
                        className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-violet-600 min-h-[100px]"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    'Salvar Alterações'
                )}
            </Button>
        </form>
    )
}
