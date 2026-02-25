'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Plus, Search, Mail, Phone, ExternalLink, MoreVertical, Briefcase, Globe } from 'lucide-react'
import { cn, formatCurrency, getStatusBadgeClass } from '@/lib/utils'
import { getClients } from '@/lib/actions/clients'
import { Client } from '@/lib/types'

export default function ClientsPage() {
    const [search, setSearch] = useState('')
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true)
            try {
                const data = await getClients(search)
                setClients(data as any)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchClients, 300)
        return () => clearTimeout(timer)
    }, [search])

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Client CRM"
                subtitle="Manage your clients, track their spending and preferences."
            />

            <div className="page-body">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
                        <span className="badge badge-accent">{clients.length} Total</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="btn btn-primary">
                            <Plus className="w-4 h-4" />
                            Add Client
                        </button>
                    </div>
                </div>

                <div className="filter-bar">
                    <div className="search-wrapper max-w-sm">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email, company..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select className="form-select h-9 text-xs">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="vip">VIP</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="table-wrapper relative min-h-[400px]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-bg-primary/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                            <div className="spinner w-8 h-8" />
                        </div>
                    )}

                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>Client Details</th>
                                <th>Company</th>
                                <th>Total Spent</th>
                                <th>Orders</th>
                                <th>Status</th>
                                <th>Country</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && clients.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <Search size={40} className="opacity-20" />
                                            <p>No clients found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-accent-subtle flex items-center justify-center text-accent font-bold text-xs uppercase border border-accent/20">
                                                {client.client_name?.split(' ').map(n => n[0]).join('') || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{client.client_name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-[10px] text-muted-foreground">{client.client_email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-xs">{client.client_company || 'Individual'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-sm font-bold text-success">{formatCurrency(client.total_spent || 0)}</p>
                                    </td>
                                    <td>
                                        <span className="text-xs font-medium">{client.total_orders || 0} Orders</span>
                                    </td>
                                    <td>
                                        <span className={cn("badge", getStatusBadgeClass(client.client_status || 'active'))}>
                                            {client.client_status || 'active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs">{client.client_country || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn-icon btn-ghost">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
