'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import {
    Download,
    Upload,
    CloudIcon,
    RefreshCcw,
    ShieldCheck,
    Database,
    History,
    AlertCircle
} from 'lucide-react'
import { cn, downloadBlob } from '@/lib/utils'
import { toast } from 'sonner'
import { getFullBackupData, getLastBackupSync, triggerBackupSync } from '@/lib/actions/backup'
import { formatDistanceToNow } from 'date-fns'

export default function BackupPage() {
    const [isSyncing, setIsSyncing] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [lastSync, setLastSync] = useState<string | null>(null)

    const fetchSyncStatus = async () => {
        try {
            const date = await getLastBackupSync()
            setLastSync(date)
        } catch (error) {
            console.error('Failed to fetch sync status:', error)
        }
    }

    useEffect(() => {
        fetchSyncStatus()
    }, [])

    const handleDownloadBackup = async () => {
        setIsDownloading(true)
        const toastId = toast.loading('Preparing full data extract...')
        try {
            const data = await getFullBackupData()
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            downloadBlob(blob, `eptasky-backup-${new Date().toISOString().split('T')[0]}.json`)
            toast.success('Backup downloaded successfully', { id: toastId })
        } catch (error) {
            toast.error('Failed to generate backup', { id: toastId })
        } finally {
            setIsDownloading(false)
        }
    }

    const handleSync = async () => {
        setIsSyncing(true)
        const toastId = toast.loading('Synchronizing with cloud...')
        try {
            await triggerBackupSync()
            await fetchSyncStatus()
            toast.success('Cloud synchronization complete', { id: toastId })
        } catch (error) {
            toast.error('Sync failed', { id: toastId })
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Backup & Restore"
                subtitle="Ensure your data is safe with cloud and local snapshots."
            />

            <div className="page-body pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cloud Backup */}
                    <div className="card border-l-4 border-l-accent">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                                    <CloudIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Cloud Synchronization</h3>
                                    <p className="text-sm text-muted-foreground">Automated daily backups to secure cloud storage.</p>
                                </div>
                            </div>
                            <span className="badge badge-active flex items-center gap-1.5 py-1 px-3">
                                <ShieldCheck size={14} />
                                Active
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Cloud Sync</span>
                                    <span className="text-xs font-black text-text-primary">
                                        {lastSync ? formatDistanceToNow(new Date(lastSync), { addSuffix: true }) : 'Never'}
                                    </span>
                                </div>
                                <div className="mt-3 w-full bg-border h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-accent h-full w-[100%]" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    className={cn("btn btn-primary flex-1", isSyncing && "opacity-50 pointer-events-none")}
                                    onClick={handleSync}
                                >
                                    <RefreshCcw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
                                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                                </button>
                                <button className="btn btn-secondary">
                                    Configure Auto-Sync
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Local Backup */}
                    <div className="card">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-bg-secondary text-text-primary">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Local Data Snapshot</h3>
                                <p className="text-sm text-muted-foreground">Download a full JSON extract of all your modules.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-hover/50 border border-border border-dashed">
                                <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Local backups contain sensitive data including client emails and pricing. Store them securely in encrypted drives.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 mt-6">
                                <button
                                    className={cn("btn btn-secondary w-full py-6", isDownloading && "opacity-50 pointer-events-none")}
                                    onClick={handleDownloadBackup}
                                >
                                    <Download className="w-5 h-5" />
                                    {isDownloading ? 'Preparing Extract...' : 'Download Full JSON Archive'}
                                </button>

                                <button className="btn btn-ghost w-full gap-2 text-muted-foreground hover:text-text-primary">
                                    <Upload className="w-4 h-4" />
                                    Restore from Local File
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / History */}
                    <div className="lg:col-span-2 card">
                        <div className="flex items-center gap-2 mb-6">
                            <History size={18} className="text-accent" />
                            <h3 className="text-lg font-bold">Backup History</h3>
                        </div>

                        <p className="text-xs text-muted-foreground italic text-center py-10 border border-dashed border-border rounded-xl">
                            Wait for tomorrow for the first automated history entry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
