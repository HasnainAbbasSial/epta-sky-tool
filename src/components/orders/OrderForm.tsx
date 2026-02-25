'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, X, ShoppingCart, User, Globe, DollarSign, Calendar, Clock, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn, formatCurrency, generateOrderReference } from '@/lib/utils'
import { OrderFormData, Website, Client } from '@/lib/types'
import { getWebsites } from '@/lib/actions/websites'
import { getClients } from '@/lib/actions/clients'

const orderSchema = z.object({
    order_reference: z.string().min(1, 'Reference is required'),
    client_id: z.string().min(1, 'Please select a client'),
    website_id: z.string().min(1, 'Please select a website'),
    order_type: z.enum(['guest_post', 'link_insertion', 'homepage_link', 'secondary_post']),
    order_status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'refunded']),
    client_price: z.number().min(0, 'Must be positive'),
    vendor_price: z.number().min(0, 'Must be positive'),
    currency: z.enum(['USD', 'PKR', 'EUR', 'GBP', 'AED']),
    payment_status_client: z.enum(['pending', 'partial', 'paid']),
    payment_status_vendor: z.enum(['pending', 'partial', 'paid']),
    order_date: z.string(),
    delivery_date: z.string().nullable().optional(),
    live_link: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface OrderFormProps {
    initialData?: Partial<OrderFormData>
    onCancel: () => void
    onSubmit: (data: OrderFormData) => void
    isLoading?: boolean
}

export function OrderForm({ initialData, onCancel, onSubmit, isLoading }: OrderFormProps) {
    const [websites, setWebsites] = useState<Website[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [isFetchingSubData, setIsFetchingSubData] = useState(true)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            order_reference: generateOrderReference(),
            order_type: 'guest_post',
            order_status: 'pending',
            payment_status_client: 'pending',
            payment_status_vendor: 'pending',
            currency: 'USD',
            order_date: new Date().toISOString().split('T')[0],
            ...initialData
        } as any
    })

    useEffect(() => {
        const loadData = async () => {
            setIsFetchingSubData(true)
            try {
                const [wData, cData] = await Promise.all([
                    getWebsites(),
                    getClients()
                ])
                setWebsites(wData as any)
                setClients(cData as any)
            } catch (err) {
                console.error(err)
            } finally {
                setIsFetchingSubData(false)
            }
        }
        loadData()
    }, [])

    const clientPrice = watch('client_price') || 0
    const vendorPrice = watch('vendor_price') || 0
    const profit = clientPrice - vendorPrice
    const margin = clientPrice > 0 ? ((profit / clientPrice) * 100).toFixed(1) : '0'

    const handleWebsiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const siteId = e.target.value
        const site = websites.find(w => w.id === siteId)
        if (site) {
            // Set defaults based on order type if prices exist
            const type = watch('order_type')
            if (type === 'guest_post') setValue('vendor_price', site.gp_price || 0)
            else if (type === 'link_insertion') setValue('vendor_price', site.li_price || 0)
            else if (type === 'homepage_link') setValue('vendor_price', site.homepage_price || 0)

            setValue('currency', site.currency || 'USD')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                        <ShoppingCart size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Order Reference</p>
                        <p className="text-sm font-bold text-accent">{watch('order_reference')}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Estimated Profit</p>
                    <p className={cn("text-sm font-bold", profit >= 0 ? "text-success" : "text-danger")}>
                        {formatCurrency(profit, watch('currency'))} ({margin}%)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label className="form-label required">Client</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                            {...register('client_id')}
                            className={cn("form-select pl-9", errors.client_id && "border-danger")}
                            disabled={isFetchingSubData}
                        >
                            <option value="">Select a client...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.client_name} ({c.client_company || 'No Company'})</option>
                            ))}
                        </select>
                    </div>
                    {errors.client_id && <p className="form-error">{errors.client_id.message}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label required">Target Website</label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                            {...register('website_id')}
                            className={cn("form-select pl-9", errors.website_id && "border-danger")}
                            onChange={handleWebsiteChange}
                            disabled={isFetchingSubData}
                        >
                            <option value="">Select a website...</option>
                            {websites.map(w => (
                                <option key={w.id} value={w.id}>{w.website_url}</option>
                            ))}
                        </select>
                    </div>
                    {errors.website_id && <p className="form-error">{errors.website_id.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                    <label className="form-label">Order Type</label>
                    <select {...register('order_type')} className="form-select">
                        <option value="guest_post">Guest Post</option>
                        <option value="link_insertion">Link Insertion</option>
                        <option value="homepage_link">Homepage Link</option>
                        <option value="secondary_post">Secondary / Author</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select {...register('order_status')} className="form-select">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Order Date</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="date" {...register('order_date')} className="form-input pl-9" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <DollarSign size={14} className="text-info" />
                        Client Pricing
                    </h4>
                    <div className="form-group">
                        <label className="form-label">Price Charged to Client</label>
                        <input
                            type="number"
                            {...register('client_price', { valueAsNumber: true })}
                            className="form-input"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Client Payment Status</label>
                        <select {...register('payment_status_client')} className="form-select">
                            <option value="pending">Pending</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <DollarSign size={14} className="text-accent" />
                        Vendor Cost
                    </h4>
                    <div className="form-group">
                        <label className="form-label">Cost from Website Vendor</label>
                        <input
                            type="number"
                            {...register('vendor_price', { valueAsNumber: true })}
                            className="form-input"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Vendor Payment Status</label>
                        <select {...register('payment_status_vendor')} className="form-select">
                            <option value="pending">Pending</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Live Link (After Completion)</label>
                <input
                    {...register('live_link')}
                    className="form-input"
                    placeholder="https://..."
                />
            </div>

            <div className="form-group">
                <label className="form-label">Order Notes / Requirements</label>
                <textarea
                    {...register('notes')}
                    className="form-textarea h-24"
                    placeholder="Keywords, anchor text, special requirements..."
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    <X size={16} />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading || isFetchingSubData}
                    className="btn btn-primary px-8"
                >
                    {isLoading ? (
                        <div className="spinner w-4 h-4" />
                    ) : (
                        <>
                            <Save size={16} />
                            Create Order
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
