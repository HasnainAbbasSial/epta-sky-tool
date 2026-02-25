'use server'

import { createClient } from '@/lib/supabase/server'
import { subMonths, format } from 'date-fns'

export async function getDashboardStats() {
    const supabase = await createClient()

    const [
        { count: totalWebsites },
        { count: totalClients },
        { count: totalOrdersCount },
        { data: allOrders },
        { data: recentActivity }
    ] = await Promise.all([
        supabase.from('websites').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('client_price, vendor_price, order_date, order_status'),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(6)
    ])

    // Aggregate monthly data for the chart (last 6 months)
    const months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i)
        return format(d, 'MMM yyyy')
    })

    const monthlyData = months.reduce((acc: any, month) => {
        acc[month] = { revenue: 0, profit: 0 }
        return acc
    }, {})

    let lifeProfit = 0
    let activeOrdersCount = 0

    allOrders?.forEach(order => {
        const month = format(new Date(order.order_date), 'MMM yyyy')
        const profit = (order.client_price || 0) - (order.vendor_price || 0)

        if (monthlyData[month]) {
            monthlyData[month].revenue += (order.client_price || 0)
            monthlyData[month].profit += profit
        }

        if (order.order_status === 'completed') {
            lifeProfit += profit
        } else if (order.order_status !== 'cancelled') {
            activeOrdersCount++
        }
    })

    const chartData = months.map(month => ({
        name: month.split(' ')[0], // Just the month name
        revenue: monthlyData[month].revenue,
        profit: monthlyData[month].profit
    }))

    return {
        stats: {
            totalWebsites: totalWebsites || 0,
            totalClients: totalClients || 0,
            totalOrders: activeOrdersCount,
            monthlyProfit: lifeProfit,
        },
        chartData,
        recentActivity: recentActivity || []
    }
}
