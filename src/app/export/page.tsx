'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
    Download,
    FileJson,
    FileText,
    Database,
    CheckCircle2,
    Globe,
    Users,
    ShoppingCart,
    Filter
} from 'lucide-react'
import { cn, downloadBlob } from '@/lib/utils'
import { getWebsites } from '@/lib/actions/websites'
import { getClients } from '@/lib/actions/clients'
import { getOrders } from '@/lib/actions/orders'
import { toast } from 'sonner'

export default function ExportPage() {
    const [isExporting, setIsExporting] = useState<string | null>(null)

    const handleExport = async (module: 'websites' | 'clients' | 'orders', format: 'json' | 'csv') => {
        setIsExporting(`${module}-${format}`)
        const toastId = toast.loading(`Generating ${module} ${format.toUpperCase()}...`)
        try {
            let data: any[] = []
            if (module === 'websites') {
                data = await getWebsites({}) as any[]
            } else if (module === 'clients') {
                // @ts-ignore - getClients currently takes params
                data = await getClients({}) as any[]
            } else if (module === 'orders') {
                // @ts-ignore - getOrders currently takes params
                data = await getOrders({}) as any[]
            }

            if (format === 'json') {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                downloadBlob(blob, `eptasky-${module}-${new Date().toISOString().split('T')[0]}.json`)
            } else {
                // Simple CSV conversion
                if (data.length === 0) {
                    toast.error('No data to export', { id: toastId })
                    return
                }
                const headers = Object.keys(data[0]).join(',')
                const rows = data.map(item =>
                    Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
                ).join('\n')
                const csv = `${headers}\n${rows}`
                const blob = new Blob([csv], { type: 'text/csv' })
                downloadBlob(blob, `eptasky-${module}-${new Date().toISOString().split('T')[0]}.csv`)
            }
            toast.success(`${module} exported successfully`, { id: toastId })
        } catch (error) {
            toast.error(`Failed to export ${module}`, { id: toastId })
        } finally {
            setIsExporting(null)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Data Export"
                subtitle="Generate CSV and JSON reports for external use."
            />

            <div className="page-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <ExportCard
                        title="Websites"
                        description="Export your full publisher inventory."
                        icon={Globe}
                        onExport={(fmt: 'json' | 'csv') => handleExport('websites', fmt)}
                        isExportingJson={isExporting === 'websites-json'}
                        isExportingCsv={isExporting === 'websites-csv'}
                    />
                    <ExportCard
                        title="Clients"
                        description="Export your CRM database and contacts."
                        icon={Users}
                        onExport={(fmt: 'json' | 'csv') => handleExport('clients', fmt)}
                        isExportingJson={isExporting === 'clients-json'}
                        isExportingCsv={isExporting === 'clients-csv'}
                    />
                    <ExportCard
                        title="Orders"
                        description="Export historical transactions and profit data."
                        icon={ShoppingCart}
                        onExport={(fmt: 'json' | 'csv') => handleExport('orders', fmt)}
                        isExportingJson={isExporting === 'orders-json'}
                        isExportingCsv={isExporting === 'orders-csv'}
                    />
                </div>

                <div className="card bg-bg-secondary/30 border-dashed">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="text-accent" size={20} />
                        <h3 className="text-lg font-bold">Advanced Export Options</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        Need filtered reports or custom date ranges? Use the main module pages to filter your search, then use the "Export" button there to get specific segments.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button className="btn btn-secondary gap-2" disabled>
                            <Filter size={14} />
                            Date Range Filter
                        </button>
                        <button className="btn btn-secondary gap-2" disabled>
                            <CheckCircle2 size={14} />
                            Only Completed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ExportCard({ title, description, icon: Icon, onExport, isExportingJson, isExportingCsv }: any) {
    return (
        <div className="card flex flex-col items-center text-center py-8 group hover:border-accent transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-black mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-[200px]">{description}</p>

            <div className="w-full flex flex-col gap-2">
                <button
                    className={cn("btn btn-primary w-full gap-2", isExportingJson && "opacity-50")}
                    onClick={() => onExport('json')}
                >
                    <FileJson size={16} />
                    {isExportingJson ? 'Generating...' : 'Export as JSON'}
                </button>
                <button
                    className={cn("btn btn-secondary w-full gap-2", isExportingCsv && "opacity-50")}
                    onClick={() => onExport('csv')}
                >
                    <FileText size={16} />
                    {isExportingCsv ? 'Generating...' : 'Export as CSV'}
                </button>
            </div>
        </div>
    )
}
