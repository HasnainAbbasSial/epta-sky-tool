'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Globe,
    Users,
    ShoppingCart,
    BarChart3,
    Download,
    Database,
    Settings,
    Bell,
    LogOut,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Overview', section: true },
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },

    { label: 'Inventory', section: true },
    { label: 'Websites', href: '/websites', icon: Globe },

    { label: 'Management', section: true },
    { label: 'Clients (CRM)', href: '/clients', icon: Users },
    { label: 'Orders & Finance', href: '/orders', icon: ShoppingCart },

    { label: 'Reporting', section: true },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Export Center', href: '/export', icon: Download },

    { label: 'System', section: true },
    { label: 'Backup & Restore', href: '/backup', icon: Database },
    { label: 'App Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <Globe className="text-white w-5 h-5" />
                </div>
                <div>
                    <h1 className="sidebar-logo-text">EPTA SKY</h1>
                    <p className="sidebar-logo-sub">Internal Tool v2.0</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item, index) => {
                    if (item.section) {
                        return (
                            <div key={index} className="sidebar-section-label">
                                {item.label}
                            </div>
                        )
                    }

                    const Icon = item.icon!
                    const isActive = pathname === item.href || (!!item.href && item.href !== '/' && !!pathname && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            className={cn(
                                "sidebar-link",
                                isActive && "active"
                            )}
                        >
                            <Icon className="sidebar-link-icon" />
                            <span>{item.label}</span>
                            {isActive && <ChevronRight className="ml-auto w-3 h-3 opacity-50" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-link text-danger hover:bg-danger-subtle">
                    <LogOut className="sidebar-link-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}
