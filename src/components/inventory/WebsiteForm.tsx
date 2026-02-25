'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Save,
    X,
    Globe,
    ShieldCheck,
    DollarSign,
    User,
    FileText,
    Star,
    Check,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES, TOP_COUNTRIES, WebsiteFormData } from '@/lib/types'

const websiteSchema = z.object({
    website_url: z.string().url('Invalid URL').min(1, 'Required'),
    website_name: z.string().min(1, 'Required'),
    type: z.enum(['general', 'pure_niche']),
    categories: z.array(z.string()).min(1, 'Select at least one category'),
    niche: z.string().optional(),
    link_type: z.enum(['dofollow', 'nofollow', 'both']),
    status: z.enum(['active', 'inactive', 'blacklisted']),
    is_pinned: z.boolean().default(false),
    internal_rating: z.number().min(1).max(5).default(3),
    language: z.string().default('English'),
    indexed_by_google: z.boolean().default(true),

    da: z.number().nullable().optional(),
    dr: z.number().nullable().optional(),
    spam_score: z.number().nullable().optional(),
    organic_traffic: z.number().nullable().optional(),
    ahrefs_traffic: z.number().nullable().optional(),
    semrush_traffic: z.number().nullable().optional(),
    top_countries: z.array(z.string()).optional(),
    traffic_source: z.enum(['ahrefs', 'semrush', 'similarweb', 'manual']).default('ahrefs'),

    gp_price: z.number().nullable().optional(),
    li_price: z.number().nullable().optional(),
    homepage_price: z.number().nullable().optional(),
    secondary_price: z.number().nullable().optional(),
    currency: z.enum(['USD', 'PKR', 'EUR', 'GBP', 'AED']).default('USD'),

    publisher_name: z.string().optional(),
    publisher_email: z.string().email().optional().or(z.literal('')),
    publisher_whatsapp: z.string().optional(),
    publisher_skype: z.string().optional(),
    publisher_other_contact: z.string().optional(),
    preferred_contact: z.string().optional(),
    payment_method: z.string().default('paypal'),

    min_word_count: z.number().nullable().optional(),
    tat_days: z.number().nullable().optional(),
    sponsored_tag_allowed: z.boolean().default(false),
    casino_allowed: z.boolean().default(false),
    cbd_allowed: z.boolean().default(false),
    adult_allowed: z.boolean().default(false),
    max_external_links: z.number().nullable().optional(),
    sample_post_url: z.string().optional(),
    guidelines_notes: z.string().optional(),

    tags: z.array(z.string()).optional(),
    last_price_updated: z.string().nullable().optional(),
    created_by: z.string().nullable().optional(),
})

interface WebsiteFormProps {
    initialData?: Partial<WebsiteFormData>
    onCancel: () => void
    onSubmit: (data: WebsiteFormData) => void
    isLoading?: boolean
}

type WebsiteFormValues = z.infer<typeof websiteSchema>

const TABS = [
    { id: 'basic', label: 'Basic Info', icon: Globe },
    { id: 'stats', label: 'SEO Stats', icon: ShieldCheck },
    { id: 'finance', label: 'Pricing', icon: DollarSign },
    { id: 'publisher', label: 'Publisher', icon: User },
    { id: 'guidelines', label: 'Guidelines', icon: FileText },
]

export function WebsiteForm({ initialData, onCancel, onSubmit, isLoading }: WebsiteFormProps) {
    const [activeTab, setActiveTab] = useState('basic')

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(websiteSchema) as any,
        defaultValues: {
            status: 'active',
            type: 'general',
            link_type: 'dofollow',
            currency: 'USD',
            categories: [],
            top_countries: [],
            internal_rating: 3,
            indexed_by_google: true,
            traffic_source: 'ahrefs',
            ...initialData
        }
    })

    const formCategories = watch('categories') || []
    const formCountries = watch('top_countries') || []
    const formRating = watch('internal_rating') || 3

    const toggleCategory = (cat: string) => {
        const current = [...(formCategories as string[])]
        if (current.includes(cat)) {
            setValue('categories', current.filter(c => c !== cat) as any)
        } else {
            setValue('categories', [...current, cat] as any)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-bg-secondary rounded-lg border border-border">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const hasError = false // Could check if errors exist in this tab's fields
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
                                activeTab === tab.id
                                    ? "bg-accent text-white shadow-lg"
                                    : "text-muted-foreground hover:bg-bg-hover hover:text-text-primary"
                            )}
                        >
                            <Icon size={16} />
                            <span className="text-sm font-medium">{tab.label}</span>
                            {hasError && <div className="w-1.5 h-1.5 rounded-full bg-danger" />}
                        </button>
                    )
                })}
            </div>

            <div className="card min-h-[400px]">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="section-title">Common Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label required">Website URL</label>
                                <input
                                    {...register('website_url')}
                                    className={cn("form-input", errors.website_url && "border-danger")}
                                    placeholder="https://example.com"
                                />
                                {errors.website_url && <p className="form-error">{errors.website_url.message}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label required">Website Name</label>
                                <input
                                    {...register('website_name')}
                                    className={cn("form-input", errors.website_name && "border-danger")}
                                    placeholder="e.g. Forbes"
                                />
                                {errors.website_name && <p className="form-error">{errors.website_name.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select {...register('type')} className="form-select">
                                    <option value="general">General</option>
                                    <option value="pure_niche">Pure Niche</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Link Type</label>
                                <select {...register('link_type')} className="form-select">
                                    <option value="dofollow">DoFollow</option>
                                    <option value="nofollow">NoFollow</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select {...register('status')} className="form-select">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="blacklisted">Blacklisted</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Categories (Required)</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleCategory(cat)}
                                        className={cn(
                                            "chip",
                                            formCategories.includes(cat) && "selected"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            {errors.categories && <p className="form-error mt-1">{errors.categories.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label">Specific Niche</label>
                                <input {...register('niche')} className="form-input" placeholder="e.g. AI SaaS, Bitcoin" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Internal Rating</label>
                                <div className="flex items-center gap-2 h-10 px-3 bg-bg-secondary rounded-lg border border-border">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={18}
                                            onClick={() => setValue('internal_rating', star)}
                                            className={cn("cursor-pointer transition-colors", star <= formRating ? "fill-gold text-gold" : "text-muted-foreground")}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="form-group flex justify-center flex-col">
                                <label className="form-label mb-2">Options</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="toggle">
                                            <input type="checkbox" {...register('is_pinned')} />
                                            <span className="toggle-slider"></span>
                                        </div>
                                        <span className="text-xs font-medium text-text-secondary group-hover:text-gold transition-colors">Pin to Top</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="toggle">
                                            <input type="checkbox" {...register('indexed_by_google')} />
                                            <span className="toggle-slider"></span>
                                        </div>
                                        <span className="text-xs font-medium text-text-secondary group-hover:text-info">Google Indexed</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Stats Tab */}
                {activeTab === 'stats' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="section-title">Authority & Traffic Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="form-group">
                                <label className="form-label">DA (Moz)</label>
                                <input type="number" {...register('da', { valueAsNumber: true })} className="form-input" placeholder="0-100" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DR (Ahrefs)</label>
                                <input type="number" {...register('dr', { valueAsNumber: true })} className="form-input" placeholder="0-100" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Spam Score (%)</label>
                                <input type="number" {...register('spam_score', { valueAsNumber: true })} className="form-input" placeholder="0-100" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Traffic Source</label>
                                <select {...register('traffic_source')} className="form-select">
                                    <option value="ahrefs">Ahrefs</option>
                                    <option value="semrush">Semrush</option>
                                    <option value="similarweb">SimilarWeb</option>
                                    <option value="manual">Manual / Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label">Organic Traffic</label>
                                <input type="number" {...register('organic_traffic', { valueAsNumber: true })} className="form-input" placeholder="Monthly unique visits" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ahrefs Traffic</label>
                                <input type="number" {...register('ahrefs_traffic', { valueAsNumber: true })} className="form-input" placeholder="Ahrefs estimate" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Semrush Traffic</label>
                                <input type="number" {...register('semrush_traffic', { valueAsNumber: true })} className="form-input" placeholder="Semrush estimate" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Top Countries (Audience)</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {TOP_COUNTRIES.map(code => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() => {
                                            const current = [...formCountries]
                                            if (current.includes(code)) setValue('top_countries', current.filter(c => c !== code))
                                            else setValue('top_countries', [...current, code])
                                        }}
                                        className={cn(
                                            "chip border-info/20 text-info bg-info-subtle",
                                            formCountries.includes(code) && "bg-info text-white"
                                        )}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Finance/Pricing Tab */}
                {activeTab === 'finance' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="section-title">Pricing & Currency</h3>
                        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 flex items-center gap-3">
                            <AlertCircle size={18} className="text-accent" />
                            <p className="text-xs text-text-secondary leading-normal">
                                Enter prices in their original currency. App will automatically track history of changes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label font-bold text-accent">Guest Post Price</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="number" {...register('gp_price', { valueAsNumber: true })} className="form-input pl-9" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link Insertion Price</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="number" {...register('li_price', { valueAsNumber: true })} className="form-input pl-9" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label">Homepage Link Price</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="number" {...register('homepage_price', { valueAsNumber: true })} className="form-input pl-9" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Secondary / Author Price</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="number" {...register('secondary_price', { valueAsNumber: true })} className="form-input pl-9" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group pt-4 border-t border-border">
                            <label className="form-label">Base Currency</label>
                            <div className="flex gap-2">
                                {['USD', 'PKR', 'EUR', 'GBP', 'AED'].map(cur => (
                                    <button
                                        key={cur}
                                        type="button"
                                        onClick={() => setValue('currency', cur as any)}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-lg border text-sm font-bold transition-all",
                                            watch('currency') === cur
                                                ? "bg-accent border-accent text-white shadow-glow"
                                                : "bg-bg-secondary border-border text-text-secondary hover:border-text-muted"
                                        )}
                                    >
                                        {cur}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Publisher Tab */}
                {activeTab === 'publisher' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="section-title">Vendor Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">Publisher / Manager Name</label>
                                <input {...register('publisher_name')} className="form-input" placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input {...register('publisher_email')} className="form-input" placeholder="email@provider.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label">WhatsApp Number</label>
                                <input {...register('publisher_whatsapp')} className="form-input" placeholder="+1..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Skype ID</label>
                                <input {...register('publisher_skype')} className="form-input" placeholder="live:abc..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Other Contact (Skype/Telegram)</label>
                                <input {...register('publisher_other_contact')} className="form-input" placeholder="@handle" />
                            </div>
                        </div>

                        <div className="form-group pt-4 border-t border-border">
                            <label className="form-label font-bold text-text-primary mb-3 block">Preferred Payment Method</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                    { id: 'paypal', label: 'PayPal' },
                                    { id: 'wise', label: 'Wise' },
                                    { id: 'bank_transfer', label: 'Bank Transfer' },
                                    { id: 'crypto_usdt', label: 'Crypto (USDT)' },
                                    { id: 'crypto_btc', label: 'Crypto (BTC)' },
                                    { id: 'cash', label: 'Cash' },
                                    { id: 'other', label: 'Other' },
                                ].map(method => (
                                    <label key={method.id} className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                                        watch('payment_method') === method.id
                                            ? "bg-accent-subtle border-accent/40 text-accent font-semibold"
                                            : "bg-bg-secondary border-border text-muted-foreground hover:bg-bg-hover"
                                    )}>
                                        <input
                                            type="radio"
                                            {...register('payment_method')}
                                            value={method.id}
                                            className="hidden"
                                        />
                                        {watch('payment_method') === method.id ? <Check size={14} /> : <div className="w-3.5 h-3.5" />}
                                        <span className="text-xs">{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Guidelines Tab */}
                {activeTab === 'guidelines' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="section-title">Strict Guidelines & Limitations</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { id: 'sponsored_tag_allowed', label: 'Sponsored Tag Allowed' },
                                { id: 'casino_allowed', label: 'Casino Allowed' },
                                { id: 'cbd_allowed', label: 'CBD Allowed' },
                                { id: 'adult_allowed', label: 'Adult Allowed' },
                            ].map(opt => (
                                <label key={opt.id} className={cn(
                                    "flex flex-col gap-3 p-4 rounded-xl border text-center transition-all cursor-pointer",
                                    watch(opt.id as any)
                                        ? "bg-success-subtle border-success/30 text-success"
                                        : "bg-bg-secondary border-border text-muted-foreground opacity-70"
                                )}>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                                    <div className="mx-auto">
                                        <div className="toggle">
                                            <input type="checkbox" {...register(opt.id as any)} />
                                            <span className="toggle-slider"></span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            <div className="form-group">
                                <label className="form-label">Min. Word Count</label>
                                <input type="number" {...register('min_word_count', { valueAsNumber: true })} className="form-input" placeholder="e.g. 600" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">TAT (Turnaround Days)</label>
                                <input type="number" {...register('tat_days', { valueAsNumber: true })} className="form-input" placeholder="e.g. 3" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max External Links</label>
                                <input type="number" {...register('max_external_links', { valueAsNumber: true })} className="form-input" placeholder="e.g. 2" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sample Post URL</label>
                            <input {...register('sample_post_url')} className="form-input" placeholder="https://..." />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Internal Notes / Detailed Guidelines</label>
                            <textarea
                                {...register('guidelines_notes')}
                                className="form-textarea h-[120px]"
                                placeholder="Mention any strict no-go areas, preferred topics, or vendor special quirks..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-center gap-1.5 text-danger animate-pulse">
                            <AlertCircle size={16} />
                            <span className="text-xs font-semibold">Please fix errors in {activeTab === 'basic' ? 'Basic Info' : 'other tabs'} before saving.</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary px-6"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary px-8 glow-accent"
                    >
                        {isLoading ? (
                            <div className="spinner" />
                        ) : (
                            <>
                                <Save size={16} />
                                Save Website
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
