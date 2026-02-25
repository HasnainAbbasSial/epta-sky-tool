'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
    const supabase = await createClient()

    const [
        { count: totalWebsites },
        { count: totalClients },
        { count: totalOrders },
        { data: activeOrders },
        { data: recentActivity }
    ] = await Promise.all([
        supabase.from('websites').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('profit').eq('order_status', 'completed'),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    const totalProfit = activeOrders?.reduce((sum, order) => sum + (Number(order.profit) || 0), 0) || 0

    return {
        stats: {
            totalWebsites: totalWebsites || 0,
            totalClients: totalClients || 0,
            totalOrders: totalOrders || 0,
            monthlyProfit: totalProfit,
        },
        recentActivity: recentActivity || []
    }
}
