'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
    Download,
    FileSpreadsheet,
    FileJson,
    Check,
    Settings,
    Eye,
    EyeOff,
    Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ExportPage() {
    const [isClientSafe, setIsClientSafe] = useState(true)

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Export Center"
                subtitle="Generate custom reports and client-ready lists in seconds."
            />

            <div className="page-body max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                    <Download className="w-8 h-8 text-accent" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
                        <p className="text-muted-foreground text-sm">Select column templates and format for your export.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="card">
                            <h3 className="section-title">1. Choose Module</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-accent bg-accent-subtle text-accent">
                                    <FileSpreadsheet />
                                    <span className="text-xs font-bold">Websites</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-bg-secondary text-muted-foreground hover:bg-bg-hover">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="text-xs font-bold">Orders</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-bg-secondary text-muted-foreground hover:bg-bg-hover">
                                    <Users className="w-5 h-5" />
                                    <span className="text-xs font-bold">Clients</span>
                                </button>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="section-title mb-0">2. Configure Columns</h3>
                                <button className="text-[10px] text-accent font-bold uppercase tracking-widest hover:underline">Select All</button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {[
                                    { id: 'url', label: 'Website URL', fixed: true },
                                    { id: 'name', label: 'Website Name' },
                                    { id: 'da', label: 'Domain Authority' },
                                    { id: 'dr', label: 'Domain Rating' },
                                    { id: 'traffic', label: 'Monthly Traffic' },
                                    { id: 'gp_price', label: 'Guest Post Price', sensitive: true },
                                    { id: 'li_price', label: 'Link Insertion Price', sensitive: true },
                                    { id: 'publisher', label: 'Publisher Info', sensitive: true },
                                    { id: 'categories', label: 'Categories' },
                                    { id: 'tat', label: 'Turnaround Time' },
                                ].map(col => (
                                    <label key={col.id} className={cn(
                                        "flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all",
                                        col.sensitive && isClientSafe && "opacity-40 grayscale pointer-events-none bg-bg-hover",
                                        !col.sensitive ? "bg-bg-secondary hover:border-text-muted" : ""
                                    )}>
                                        <input type="checkbox" defaultChecked={!col.sensitive} disabled={col.sensitive && isClientSafe} className="rounded border-border bg-bg-secondary" />
                                        <span className="flex-1">{col.label}</span>
                                        {col.sensitive && <AlertCircle size={10} className="text-warning" />}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card bg-accent-subtle/20 border-accent/20">
                            <h3 className="card-title mb-4 flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Export Mode
                            </h3>
                            <div className="space-y-4">
                                <div
                                    onClick={() => setIsClientSafe(true)}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all",
                                        isClientSafe ? "bg-white text-black border-white shadow-glow" : "bg-bg-secondary border-border"
                                    )}
                                >
                                    <div className={cn("p-1.5 rounded-md", isClientSafe ? "bg-black text-white" : "bg-muted text-muted-foreground")}>
                                        <EyeOff size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Client-Ready</p>
                                        <p className="text-[9px] opacity-70">Hide sensitive data (prices, contacts)</p>
                                    </div>
                                    {isClientSafe && <Check size={14} className="ml-auto" />}
                                </div>

                                <div
                                    onClick={() => setIsClientSafe(false)}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all",
                                        !isClientSafe ? "bg-warning text-black border-warning shadow-lg" : "bg-bg-secondary border-border"
                                    )}
                                >
                                    <div className={cn("p-1.5 rounded-md", !isClientSafe ? "bg-black text-white" : "bg-muted text-muted-foreground")}>
                                        <Eye size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Internal / Full</p>
                                        <p className="text-[9px] opacity-70">Include all vendor info & prices</p>
                                    </div>
                                    {!isClientSafe && <Check size={14} className="ml-auto" />}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="card-title mb-4">Export Format</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="flex items-center gap-2 p-3 rounded-lg border border-success/30 bg-success-subtle text-success text-xs font-bold">
                                    <FileSpreadsheet size={16} />
                                    EXCEL
                                </button>
                                <button className="flex items-center gap-2 p-3 rounded-lg border border-info/30 bg-info-subtle text-info text-xs font-bold">
                                    <FileJson size={16} />
                                    JSON
                                </button>
                            </div>
                            <button className="btn btn-primary w-full mt-4 h-11 glow-accent">
                                <Download size={18} />
                                Download Export
                            </button>
                        </div>

                        <div className="p-4 rounded-xl border border-dashed border-border bg-bg-secondary/30">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <Star size={10} className="fill-gold text-gold" />
                                Saved Templates
                            </h4>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-text-primary px-2 py-1.5 hover:bg-bg-hover rounded cursor-pointer">Technology List (Safe)</p>
                                <p className="text-xs font-medium text-text-primary px-2 py-1.5 hover:bg-bg-hover rounded cursor-pointer">Finance Sites (Internal)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShoppingCart(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}
function AlertCircle(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}
