'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, X, User, Mail, Phone, Briefcase, Globe, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES, ClientFormData } from '@/lib/types'

const clientSchema = z.object({
    client_name: z.string().min(1, 'Name is required'),
    client_email: z.string().email('Invalid email address'),
    client_company: z.string().optional(),
    client_whatsapp: z.string().optional(),
    client_skype: z.string().optional(),
    client_country: z.string().optional(),
    client_status: z.enum(['active', 'inactive', 'vip']),
    preferred_niches: z.array(z.string()).default([]),
    preferred_budget_min: z.number().nullable().optional(),
    preferred_budget_max: z.number().nullable().optional(),
    notes: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
    initialData?: Partial<ClientFormData>
    onCancel: () => void
    onSubmit: (data: ClientFormData) => void
    isLoading?: boolean
}

export function ClientForm({ initialData, onCancel, onSubmit, isLoading }: ClientFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(clientSchema) as any,
        defaultValues: {
            client_status: 'active',
            preferred_niches: [],
            ...initialData
        } as any
    })

    const selectedNiches = watch('preferred_niches') || []

    const toggleNiche = (niche: string) => {
        const current = [...selectedNiches]
        if (current.includes(niche)) {
            setValue('preferred_niches', current.filter(n => n !== niche))
        } else {
            setValue('preferred_niches', [...current, niche])
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label className="form-label required">Full Name</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            {...register('client_name')}
                            className={cn("form-input pl-9", errors.client_name && "border-danger")}
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.client_name && <p className="form-error">{String(errors.client_name.message)}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label required">Email Address</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            {...register('client_email')}
                            className={cn("form-input pl-9", errors.client_email && "border-danger")}
                            placeholder="john@example.com"
                        />
                    </div>
                    {errors.client_email && <p className="form-error">{String(errors.client_email.message)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <div className="relative">
                        <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            {...register('client_company')}
                            className="form-input pl-9"
                            placeholder="e.g. Digital Pulse Agency"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select {...register('client_status')} className="form-select">
                        <option value="active">Active</option>
                        <option value="vip">VIP (High Priority)</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                    <label className="form-label">WhatsApp</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            {...register('client_whatsapp')}
                            className="form-input pl-9"
                            placeholder="+1..."
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Skype / Telegram</label>
                    <input
                        {...register('client_skype')}
                        className="form-input"
                        placeholder="@username"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Country</label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            {...register('client_country')}
                            className="form-input pl-9"
                            placeholder="e.g. United Kingdom"
                        />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Preferred Niches</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {CATEGORIES.map(niche => (
                        <button
                            key={niche}
                            type="button"
                            onClick={() => toggleNiche(niche)}
                            className={cn(
                                "chip",
                                selectedNiches.includes(niche) && "selected"
                            )}
                        >
                            {niche}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label className="form-label">Monthly Budget Min (USD)</label>
                    <input
                        type="number"
                        {...register('preferred_budget_min', { valueAsNumber: true })}
                        className="form-input"
                        placeholder="0"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Monthly Budget Max (USD)</label>
                    <input
                        type="number"
                        {...register('preferred_budget_max', { valueAsNumber: true })}
                        className="form-input"
                        placeholder="5000"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Internal Notes</label>
                <textarea
                    {...register('notes')}
                    className="form-textarea h-24"
                    placeholder="Describe client preferences, special pricing agreements, or history..."
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    <X size={16} />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary px-8"
                >
                    {isLoading ? (
                        <div className="spinner w-4 h-4" />
                    ) : (
                        <>
                            <Save size={16} />
                            Save Client
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
