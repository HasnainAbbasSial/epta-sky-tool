'use client'

import { Header } from '@/components/layout/Header'
import {
    Settings as SettingsIcon,
    User,
    Shield,
    Palette,
    Bell,
    Globe,
    CreditCard,
    Plus,
    Trash2,
    Check
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const SETTINGS_TABS = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'app', label: 'App Branding', icon: Palette },
    { id: 'notifications', label: 'Alert Settings', icon: Bell },
    { id: 'categories', label: 'Manage Categories', icon: Globe },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'users', label: 'User Roles', icon: Shield },
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')

    return (
        <div className="flex flex-col h-full">
            <Header
                title="App Settings"
                subtitle="Configure your application preferences, categories, and security."
            />

            <div className="page-body max-w-5xl mx-auto w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Navigation Sidebar (Local) */}
                    <div className="w-full md:w-64 space-y-1">
                        {SETTINGS_TABS.map(tab => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                        activeTab === tab.id
                                            ? "bg-accent text-white shadow-glow"
                                            : "text-muted-foreground hover:bg-bg-secondary hover:text-text-primary"
                                    )}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === 'profile' && (
                            <div className="card space-y-6 animate-in fade-in duration-300">
                                <h3 className="section-title">Personal Settings</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-accent-subtle border-2 border-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
                                        A
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary btn-sm">Change Avatar</button>
                                        <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">Max size: 2MB. Format: JPG, PNG.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input className="form-input" defaultValue="Epta Sky Admin" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input className="form-input" defaultValue="admin@eptasky.com" readOnly />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-end">
                                    <button className="btn btn-primary">Save Profile</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div className="card space-y-6 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="section-title mb-0">Website Categories</h3>
                                    <button className="btn btn-primary btn-sm">
                                        <Plus size={14} />
                                        Add Category
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {['Business', 'Health', 'Travel', 'Crypto', 'Gaming', 'Auto', 'Home', 'Legal'].map(cat => (
                                        <div key={cat} className="p-3 rounded-lg border border-border bg-bg-secondary flex items-center justify-between group">
                                            <span className="text-sm font-medium">{cat}</span>
                                            <button className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="card space-y-6 animate-in fade-in duration-300">
                                <h3 className="section-title">Payment Methods</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'PayPal', desc: 'Secure online payments', status: 'Enabled' },
                                        { name: 'Wise', desc: 'Global bank transfers', status: 'Enabled' },
                                        { name: 'USDT (Tether)', desc: 'Binance / Trust Wallet', status: 'Enabled' },
                                    ].map(method => (
                                        <div key={method.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-secondary/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-bg-hover flex items-center justify-center">
                                                    <CreditCard size={18} className="text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{method.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="badge badge-active text-[9px] uppercase">{method.status}</span>
                                                <button className="btn-icon btn-ghost btn-sm"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-xs font-bold text-muted-foreground hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                                        <Plus size={14} />
                                        Add New Payment Method
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
