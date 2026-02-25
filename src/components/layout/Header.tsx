'use client'

import { Bell, Search, User, Settings as SettingsIcon } from 'lucide-react'

interface HeaderProps {
    title: string
    subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className="page-header">
            <div>
                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                <div className="search-wrapper max-w-[300px] hidden md:block">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="search-input"
                    />
                </div>

                <button className="notif-bell btn-icon btn-ghost">
                    <Bell className="w-5 h-5" />
                    <span className="notif-dot" />
                </button>

                <div className="h-8 w-[1px] bg-border mx-1" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold leading-none">Admin User</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">Admin Role</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-accent-subtle border border-accent/20 flex items-center justify-center text-accent">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    )
}
