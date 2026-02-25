'use client'

import { Header } from '@/components/layout/Header'
import { Database, Download, Upload, History, Cloud, Server, AlertTriangle } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

const MOCK_BACKUPS = [
    { id: '1', date: '2026-02-24T12:00:00Z', size: '1.2 MB', type: 'auto', status: 'success' },
    { id: '2', date: '2026-02-23T12:00:00Z', size: '1.18 MB', type: 'auto', status: 'success' },
    { id: '3', date: '2026-02-23T09:45:00Z', size: '1.15 MB', type: 'manual', status: 'success' },
    { id: '4', date: '2026-02-22T12:00:00Z', size: '0 MB', type: 'auto', status: 'failed' },
]

export default function BackupPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Backup & Restore"
                subtitle="Safeguard your entire business data with cloud and local backups."
            />

            <div className="page-body max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="card border-l-4 border-l-accent overflow-hidden relative">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-subtle text-accent flex items-center justify-center">
                                <Cloud size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Cloud Backup</h2>
                                <p className="text-xs text-muted-foreground">Automatic daily sync to Supabase</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Last Successful</p>
                                <p className="text-sm font-bold">Today, 12:00 PM</p>
                            </div>
                            <button className="btn btn-primary btn-sm">Sync Now</button>
                        </div>
                        <div className="absolute top-0 right-0 p-2">
                            <div className="badge badge-active animate-pulse">Live</div>
                        </div>
                    </div>

                    <div className="card border-l-4 border-l-success">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-success-subtle text-success flex items-center justify-center">
                                <Download size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Local Backup</h2>
                                <p className="text-xs text-muted-foreground">Download full data as JSON file</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button className="btn btn-secondary flex-1">
                                <Download size={16} />
                                Download JSON
                            </button>
                            <button className="btn btn-secondary flex-1">
                                <Upload size={16} />
                                Import / Restore
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="section-title mb-0 flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Backup History
                        </h3>
                        <button className="text-[10px] text-muted-foreground uppercase tracking-widest hover:text-text-primary">Clear Log</button>
                    </div>

                    <div className="table-wrapper">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Status</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_BACKUPS.map(b => (
                                    <tr key={b.id}>
                                        <td className="text-sm font-medium">{formatDate(b.date)} at {new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>
                                            <span className={cn("badge py-0 px-2 h-5 text-[9px] font-bold uppercase", b.type === 'auto' ? 'bg-bg-hover text-muted-foreground' : 'badge-accent')}>
                                                {b.type}
                                            </span>
                                        </td>
                                        <td className="text-xs">{b.size}</td>
                                        <td>
                                            <span className={cn("flex items-center gap-1.5 font-bold text-[11px]", b.status === 'success' ? 'text-success' : 'text-danger')}>
                                                {b.status === 'success' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                                {b.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-icon btn-ghost btn-sm" disabled={b.status === 'failed'}>
                                                <Download size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card bg-danger-subtle/10 border-danger/20 p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-danger/20 text-danger flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-danger mb-1">Critical Data Operations</h4>
                        <p className="text-xs text-text-secondary leading-relaxed mb-4">
                            Restoring from a backup will overwrite all current local data. This action is irreversible. Always download a local backup before performing a full restore.
                        </p>
                        <button className="btn btn-danger text-xs px-4">Force System Reset</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CheckCircle2(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
    )
}
