'use server'

import { createClient } from '@/lib/supabase/server'
import { startOfMonth, subMonths, format, endOfMonth } from 'date-fns'

export async function getAnalyticsStats() {
    const supabase = await createClient()

    // 1. Get all orders to calculate stats
    const { data: orders, error } = await supabase
        .from('orders')
        .select('client_price, vendor_price, order_date, order_status')
        .order('order_date', { ascending: true })

    if (error) throw error

    // 2. Aggregate by month (Last 6 months)
    const months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i)
        return format(d, 'MMM yyyy')
    })

    const monthlyData = months.reduce((acc: any, month) => {
        acc[month] = { revenue: 0, profit: 0, count: 0 }
        return acc
    }, {})

    let totalRevenue = 0
    let totalProfit = 0
    let completedOrders = 0

    orders.forEach(order => {
        const month = format(new Date(order.order_date), 'MMM yyyy')
        const rev = order.client_price || 0
        const profit = rev - (order.vendor_price || 0)

        if (monthlyData[month]) {
            monthlyData[month].revenue += rev
            monthlyData[month].profit += profit
            monthlyData[month].count += 1
        }

        if (order.order_status === 'completed') {
            totalRevenue += rev
            totalProfit += profit
            completedOrders++
        }
    })

    const chartData = months.map(month => ({
        name: month,
        revenue: monthlyData[month].revenue,
        profit: monthlyData[month].profit,
        orders: monthlyData[month].count
    }))

    // 3. Status Breakdown
    const statusCounts = orders.reduce((acc: any, order) => {
        acc[order.order_status] = (acc[order.order_status] || 0) + 1
        return acc
    }, {})

    const statusData = [
        { name: 'Completed', value: statusCounts['completed'] || 0, color: '#10b981' },
        { name: 'In Progress', value: statusCounts['in_progress'] || 0, color: '#3b82f6' },
        { name: 'Pending', value: statusCounts['pending'] || 0, color: '#f59e0b' },
        { name: 'Cancelled', value: statusCounts['cancelled'] || 0, color: '#ef4444' },
    ]

    return {
        chartData,
        statusData,
        summary: {
            totalRevenue,
            totalProfit,
            avgMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
            completedOrders,
            totalOrders: orders.length
        }
    }
}
