'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import {
    Plus,
    Search,
    ShoppingCart,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreVertical,
    ExternalLink,
    DollarSign,
    Trash2,
    Edit
} from 'lucide-react'
import { cn, formatCurrency, getStatusBadgeClass, formatDate } from '@/lib/utils'
import { getOrders, createOrder, updateOrder, deleteOrder } from '@/lib/actions/orders'
import { Order, OrderFormData } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import { OrderForm } from '@/components/orders/OrderForm'

import { toast } from 'sonner'

export default function OrdersPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingOrder, setEditingOrder] = useState<Order | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const data = await getOrders({ search, status: statusFilter })
            setOrders(data as any)
        } catch (error) {
            toast.error('Failed to fetch orders')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(fetchOrders, 300)
        return () => clearTimeout(timer)
    }, [search, statusFilter])

    const handleAddOrder = async (data: OrderFormData) => {
        setIsSubmitting(true)
        const toastId = toast.loading('Creating new order...')
        try {
            await createOrder(data)
            toast.success('Order created successfully', { id: toastId })
            setIsAddModalOpen(false)
            fetchOrders()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create order', { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditOrder = async (data: OrderFormData) => {
        if (!editingOrder) return
        setIsSubmitting(true)
        const toastId = toast.loading('Updating order details...')
        try {
            await updateOrder(editingOrder.id, data)
            toast.success('Order updated successfully', { id: toastId })
            setEditingOrder(null)
            fetchOrders()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update order', { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteOrder = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return
        setIsDeleting(id)
        const toastId = toast.loading('Removing order...')
        try {
            await deleteOrder(id)
            toast.success('Order deleted successfully', { id: toastId })
            fetchOrders()
        } catch (error) {
            toast.error('Failed to delete order', { id: toastId })
        } finally {
            setIsDeleting(null)
        }
    }

    const activeOrdersCount = orders.filter(o => o.order_status !== 'completed' && o.order_status !== 'cancelled').length

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Orders & Transactions"
                subtitle="Track delivery, payments, and profit margins."
            />

            <div className="page-body">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                        <span className="badge badge-accent">{activeOrdersCount} Active</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            New Order
                        </button>
                    </div>
                </div>

                <div className="filter-bar">
                    <div className="search-wrapper max-w-sm">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by ORD#, client, website..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="form-select h-9 text-xs"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
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
                                <th>Order Ref</th>
                                <th>Client / Website</th>
                                <th>Details</th>
                                <th>Finance (Profit)</th>
                                <th>Payment Status</th>
                                <th>Status</th>
                                <th className="w-10 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-24">
                                        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                                            <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-4 text-muted-foreground/30">
                                                <ShoppingCart size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold mb-1">No orders found</h3>
                                            <p className="text-sm text-muted-foreground">We couldn't find any orders matching your current search or status filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {orders.map(order => {
                                const profit = (order.client_price || 0) - (order.vendor_price || 0)
                                const margin = order.client_price ? ((profit / order.client_price) * 100).toFixed(1) : '0'

                                return (
                                    <tr key={order.id} className="group">
                                        <td>
                                            <p className="text-sm font-bold text-accent">{order.order_reference}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">{formatDate(order.order_date)}</p>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-text-primary">{order.client_name_snapshot}</span>
                                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs text-info font-medium italic">{order.website_url_snapshot}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-xs capitalize">{order.order_type.replace('_', ' ')}</span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-text-primary">{formatCurrency(order.client_price)}</span>
                                                    <span className="text-[10px] text-success font-bold">+{formatCurrency(profit)}</span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">Margin: {margin}%</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Client</span>
                                                    <span className={cn("badge py-0 px-1.5 h-4 text-[9px]", order.payment_status_client === 'paid' ? 'badge-active' : 'badge-warning')}>
                                                        {order.payment_status_client}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Vendor</span>
                                                    <span className={cn("badge py-0 px-1.5 h-4 text-[9px]", order.payment_status_vendor === 'paid' ? 'badge-active' : 'badge-warning')}>
                                                        {order.payment_status_vendor}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={cn("badge", getStatusBadgeClass(order.order_status))}>
                                                {order.order_status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                {order.order_status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                                                {order.order_status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-1 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="btn-icon btn-ghost btn-sm"
                                                    onClick={() => setEditingOrder(order)}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    className="btn-icon btn-ghost btn-sm text-danger hover:bg-danger/10"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Create New Order"
            >
                <OrderForm
                    onCancel={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddOrder}
                    isLoading={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={!!editingOrder}
                onClose={() => setEditingOrder(null)}
                title="Edit Order"
            >
                {editingOrder && (
                    <OrderForm
                        initialData={editingOrder}
                        onCancel={() => setEditingOrder(null)}
                        onSubmit={handleEditOrder}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    )
}
