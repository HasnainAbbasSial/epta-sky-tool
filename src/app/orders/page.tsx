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
    DollarSign
} from 'lucide-react'
import { cn, formatCurrency, getStatusBadgeClass, formatDate } from '@/lib/utils'
import { getOrders } from '@/lib/actions/orders'
import { Order } from '@/lib/types'

export default function OrdersPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const data = await getOrders({ search, status: statusFilter })
                setOrders(data as any)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchOrders, 300)
        return () => clearTimeout(timer)
    }, [search, statusFilter])

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
                        <button className="btn btn-secondary">
                            <DollarSign className="w-4 h-4" />
                            Reports
                        </button>
                        <button className="btn btn-primary">
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
                        <select className="form-select h-9 text-xs">
                            <option value="">Order Type</option>
                            <option value="guest_post">Guest Post</option>
                            <option value="link_insertion">Link Insertion</option>
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
                                <th>Order Ref</th>
                                <th>Client / Website</th>
                                <th>Details</th>
                                <th>Finance (Profit)</th>
                                <th>Payment Status</th>
                                <th>Status</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <ShoppingCart size={40} className="opacity-20" />
                                            <p>No orders found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {orders.map(order => {
                                const profit = (order.client_price || 0) - (order.vendor_price || 0)
                                const margin = order.client_price ? ((profit / order.client_price) * 100).toFixed(1) : '0'

                                return (
                                    <tr key={order.id}>
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
                                            <button className="btn-icon btn-ghost">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
