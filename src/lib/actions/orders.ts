'use server'

import { createClient } from '@/lib/supabase/server'
import { OrderFormData } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function createOrder(data: OrderFormData) {
    const supabase = await createClient()

    // Generate reference if not provided (should be auto in schema but good to have)
    const { data: inserted, error } = await supabase
        .from('orders')
        .insert([data])
        .select()
        .single()

    if (error) {
        console.error('Error creating order:', error)
        throw new Error(error.message)
    }

    // Update Website "times_ordered" count
    await supabase.rpc('increment_website_orders', { row_id: data.website_id })

    // Log Activity
    await supabase.from('activity_logs').insert([
        {
            action: 'create',
            module: 'orders',
            record_id: inserted.id,
            record_label: inserted.order_reference,
            details: { ref: inserted.order_reference, site: inserted.website_url_snapshot }
        }
    ])

    revalidatePath('/orders')
    revalidatePath('/')

    return inserted
}

export async function getOrders(filters?: any) {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters?.search) {
        query = query.or(`order_reference.ilike.%${filters.search}%,client_name_snapshot.ilike.%${filters.search}%,website_url_snapshot.ilike.%${filters.search}%`)
    }

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('order_status', filters.status)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching orders:', error)
        return []
    }

    return data
}

export async function updateOrder(id: string, data: OrderFormData) {
    const supabase = await createClient()

    const { data: updated, error } = await supabase
        .from('orders')
        .update(data)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error

    // Log Activity
    await supabase.from('activity_logs').insert([
        {
            action: 'update',
            module: 'orders',
            record_id: id,
            record_label: updated.order_reference,
            details: { ref: updated.order_reference, status: updated.order_status }
        }
    ])

    revalidatePath('/orders')
    revalidatePath('/')

    return updated
}

export async function deleteOrder(id: string) {
    const supabase = await createClient()

    // 1. Get order details to update website count
    const { data: order } = await supabase
        .from('orders')
        .select('order_reference, website_id')
        .eq('id', id)
        .single()

    if (!order) return

    // 2. Delete order
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

    if (error) throw error

    // 3. Decrement Website "times_ordered" count
    await supabase.rpc('decrement_website_orders', { row_id: order.website_id })

    // 4. Log Activity
    await supabase.from('activity_logs').insert([
        {
            action: 'delete',
            module: 'orders',
            record_id: id,
            record_label: order.order_reference
        }
    ])

    revalidatePath('/orders')
    revalidatePath('/')
}
