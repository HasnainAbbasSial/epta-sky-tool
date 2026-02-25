'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import {
    User,
    Settings as SettingsIcon,
    Lock,
    Bell,
    Globe,
    CreditCard,
    Save,
    Plus,
    X,
    CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAppSettings, updateAppSettings, updateProfile } from '@/lib/actions/settings'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState<any>({ categories: [], paymentMethods: [] })
    const [newCategory, setNewCategory] = useState('')
    const [newPayment, setNewPayment] = useState('')
    const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@eptasky.com' })

    useEffect(() => {
        async function load() {
            try {
                const data = await getAppSettings()
                setSettings(data)
            } catch (error) {
                toast.error('Failed to load settings')
            }
        }
        load()
    }, [])

    const handleSaveProfile = async () => {
        setIsLoading(true)
        const toastId = toast.loading('Updating profile...')
        try {
            await updateProfile(profile)
            toast.success('Profile updated successfully', { id: toastId })
        } catch (error) {
            toast.error('Failed to update profile', { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddCategory = async () => {
        if (!newCategory) return
        const updated = [...settings.categories, newCategory]
        setSettings({ ...settings, categories: updated })
        await updateAppSettings('categories', updated)
        setNewCategory('')
    }

    const handleRemoveCategory = async (cat: string) => {
        const updated = settings.categories.filter((c: string) => c !== cat)
        setSettings({ ...settings, categories: updated })
        await updateAppSettings('categories', updated)
    }

    const handleAddPayment = async () => {
        if (!newPayment) return
        const updated = [...settings.paymentMethods, newPayment]
        setSettings({ ...settings, paymentMethods: updated })
        await updateAppSettings('payment_methods', updated)
        setNewPayment('')
    }

    const handleRemovePayment = async (pay: string) => {
        const updated = settings.paymentMethods.filter((p: string) => p !== pay)
        setSettings({ ...settings, paymentMethods: updated })
        await updateAppSettings('payment_methods', updated)
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="System Settings"
                subtitle="Configure application preferences and manage your profile."
            />

            <div className="page-body pb-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Nav */}
                    <div className="w-full lg:w-64 space-y-1">
                        <NavButton
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                            icon={User}
                            label="Account Profile"
                        />
                        <NavButton
                            active={activeTab === 'general'}
                            onClick={() => setActiveTab('general')}
                            icon={SettingsIcon}
                            label="Module Config"
                        />
                        <NavButton
                            active={activeTab === 'security'}
                            onClick={() => setActiveTab('security')}
                            icon={Lock}
                            label="Security & Auth"
                        />
                        <NavButton
                            active={activeTab === 'notifications'}
                            onClick={() => setActiveTab('notifications')}
                            icon={Bell}
                            label="Notifications"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === 'profile' && (
                            <div className="card max-w-2xl">
                                <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase">Display Name</label>
                                            <input
                                                type="text"
                                                className="input w-full"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                                            <input
                                                type="email"
                                                className="input w-full"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex border-t border-border">
                                        <button
                                            className={cn("btn btn-primary gap-2", isLoading && "opacity-50")}
                                            onClick={handleSaveProfile}
                                        >
                                            <Save size={16} />
                                            {isLoading ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                {/* Categories */}
                                <div className="card">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Globe size={18} className="text-accent" />
                                        <h3 className="text-lg font-bold">Inventory Categories</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {settings.categories.map((cat: string) => (
                                            <span key={cat} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary text-xs font-bold border border-border">
                                                {cat}
                                                <button onClick={() => handleRemoveCategory(cat)} className="text-muted-foreground hover:text-danger">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            type="text"
                                            className="input flex-1"
                                            placeholder="Add new category..."
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                        />
                                        <button className="btn btn-primary btn-icon" onClick={handleAddCategory}>
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="card">
                                    <div className="flex items-center gap-2 mb-6">
                                        <CreditCard size={18} className="text-success" />
                                        <h3 className="text-lg font-bold">Payment Methods</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {settings.paymentMethods.map((pay: string) => (
                                            <span key={pay} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary text-xs font-bold border border-border">
                                                {pay}
                                                <button onClick={() => handleRemovePayment(pay)} className="text-muted-foreground hover:text-danger">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            type="text"
                                            className="input flex-1"
                                            placeholder="Add payment method..."
                                            value={newPayment}
                                            onChange={(e) => setNewPayment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddPayment()}
                                        />
                                        <button className="btn btn-primary btn-icon" onClick={handleAddPayment}>
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'security' || activeTab === 'notifications') && (
                            <div className="card flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-4 text-muted-foreground">
                                    <SettingsIcon size={32} />
                                </div>
                                <h3 className="text-lg font-bold">Under Maintenance</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">This settings module is being optimized for the next security update.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                active
                    ? "bg-accent text-white shadow-glow"
                    : "text-muted-foreground hover:bg-bg-secondary hover:text-text-primary"
            )}
        >
            <Icon size={18} />
            {label}
        </button>
    )
}
