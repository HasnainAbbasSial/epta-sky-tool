import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Currency } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency: Currency = 'USD'): string {
    if (amount === null || amount === undefined) return '—'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

export function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return '—'
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).format(new Date(dateStr))
}

export function generateOrderReference(): string {
    const now = new Date()
    const year = now.getFullYear()
    const rand = Math.floor(Math.random() * 9000) + 1000
    return `ORD-${year}-${rand}`
}

export function calculateProfit(clientPrice: number, vendorPrice: number) {
    const profit = clientPrice - vendorPrice
    const margin = clientPrice > 0 ? (profit / clientPrice) * 100 : 0
    return { profit, profit_margin_pct: parseFloat(margin.toFixed(2)) }
}

export function extractTaxYear(dateStr: string): string {
    return new Date(dateStr).getFullYear().toString()
}

export function getDaColor(da: number | null): string {
    if (da === null) return 'text-muted-foreground'
    if (da >= 70) return 'text-emerald-400'
    if (da >= 50) return 'text-yellow-400'
    if (da >= 30) return 'text-orange-400'
    return 'text-red-400'
}

export function getDrColor(dr: number | null): string {
    return getDaColor(dr)
}

export function getSpamColor(spam: number | null): string {
    if (spam === null) return 'text-muted-foreground'
    if (spam <= 5) return 'text-emerald-400'
    if (spam <= 15) return 'text-yellow-400'
    if (spam <= 30) return 'text-orange-400'
    return 'text-red-400'
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function getStatusBadgeClass(status: string): string {
    switch (status) {
        case 'active': return 'badge-active'
        case 'inactive': return 'badge-inactive'
        case 'blacklisted': return 'badge-danger'
        case 'completed': return 'badge-active'
        case 'pending': return 'badge-warning'
        case 'in_progress': return 'badge-info'
        case 'cancelled': return 'badge-inactive'
        case 'refunded': return 'badge-danger'
        case 'paid': return 'badge-active'
        case 'partial': return 'badge-warning'
        case 'vip': return 'badge-vip'
        default: return 'badge-inactive'
    }
}

export function formatLabel(str: string): string {
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function normalizeDomain(url: string): string {
    try {
        const u = new URL(url.startsWith('http') ? url : `https://${url}`)
        return u.hostname.replace(/^www\./, '').toLowerCase()
    } catch {
        return url.toLowerCase().replace(/^www\./, '')
    }
}
