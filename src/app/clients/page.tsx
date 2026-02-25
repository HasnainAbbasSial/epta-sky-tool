'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Plus, Search, Mail, Phone, ExternalLink, MoreVertical, Briefcase, Globe, Trash2, Edit, Users } from 'lucide-react'
import { cn, formatCurrency, getStatusBadgeClass } from '@/lib/utils'
import { getClients, createClientRecord, updateClientRecord, deleteClient } from '@/lib/actions/clients'
import { Client, ClientFormData } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import { ClientForm } from '@/components/crm/ClientForm'

import { toast } from 'sonner'

export default function ClientsPage() {
    const [search, setSearch] = useState('')
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<Client | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchClients = async () => {
        setIsLoading(true)
        try {
            const data = await getClients(search)
            setClients(data as any)
        } catch (error) {
            toast.error('Failed to fetch CRM data')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(fetchClients, 300)
        return () => clearTimeout(timer)
    }, [search])

    const handleAddClient = async (data: ClientFormData) => {
        setIsSubmitting(true)
        const toastId = toast.loading('Adding new client...')
        try {
            await createClientRecord(data)
            toast.success('Client registered successfully', { id: toastId })
            setIsAddModalOpen(false)
            fetchClients()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create client', { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClient = async (data: ClientFormData) => {
        if (!editingClient) return
        setIsSubmitting(true)
        const toastId = toast.loading('Updating client info...')
        try {
            await updateClientRecord(editingClient.id, data)
            toast.success('Client profile updated', { id: toastId })
            setEditingClient(null)
            fetchClients()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update client', { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClient = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return
        setIsDeleting(id)
        const toastId = toast.loading('Removing client...')
        try {
            await deleteClient(id)
            toast.success('Client removed successfully', { id: toastId })
            fetchClients()
        } catch (error) {
            toast.error('Failed to delete client', { id: toastId })
        } finally {
            setIsDeleting(null)
        }
    }

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
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsAddModalOpen(true)}
                        >
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
                </div>

                <div className="table-wrapper relative min-h-[400px]">
                    {(isLoading || isDeleting) && (
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
                                <th className="w-10 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && clients.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-24">
                                        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                                            <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-4 text-muted-foreground/30">
                                                <Users size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold mb-1">No clients found</h3>
                                            <p className="text-sm text-muted-foreground">We couldn't find any clients matching your current search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {clients.map(client => (
                                <tr key={client.id} className="group">
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
                                        <div className="flex items-center justify-end gap-1 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="btn-icon btn-ghost btn-sm"
                                                onClick={() => setEditingClient(client)}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn-icon btn-ghost btn-sm text-danger hover:bg-danger/10"
                                                onClick={() => handleDeleteClient(client.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Client"
            >
                <ClientForm
                    onCancel={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddClient}
                    isLoading={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={!!editingClient}
                onClose={() => setEditingClient(null)}
                title="Edit Client"
            >
                {editingClient && (
                    <ClientForm
                        initialData={editingClient}
                        onCancel={() => setEditingClient(null)}
                        onSubmit={handleEditClient}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    )
}
