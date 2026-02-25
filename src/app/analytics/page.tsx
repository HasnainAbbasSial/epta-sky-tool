'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import {
    Download,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingCart,
    Target,
    BarChart3
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { getAnalyticsStats } from '@/lib/actions/analytics'

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            try {
                const data = await getAnalyticsStats()
                setStats(data)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    if (isLoading || !stats) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Performance Analytics" subtitle="Real-time business intelligence and financial reporting." />
                <div className="page-body flex items-center justify-center min-h-[400px]">
                    <div className="spinner w-8 h-8" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Performance Analytics"
                subtitle="Real-time business intelligence and financial reporting."
            />

            <div className="page-body pb-10">
                {/* Filters & Export */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 p-1 bg-bg-secondary rounded-lg border border-border">
                            <button className="px-4 py-1.5 text-xs font-bold bg-accent text-white rounded-md shadow-sm">Last 6 Months</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground hover:text-text-primary">Year to Date</button>
                        </div>
                    </div>

                    <button className="btn btn-secondary">
                        <Download className="w-4 h-4" />
                        Export Full Report
                    </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        label="Total Revenue"
                        value={formatCurrency(stats.summary.totalRevenue)}
                        icon={DollarSign}
                        trend="+12.5%"
                        isUp={true}
                        color="text-success"
                    />
                    <MetricCard
                        label="Net Profit"
                        value={formatCurrency(stats.summary.totalProfit)}
                        icon={TrendingUp}
                        trend="+8.2%"
                        isUp={true}
                        color="text-accent"
                    />
                    <MetricCard
                        label="Order Volume"
                        value={`${stats.summary.totalOrders}`}
                        icon={ShoppingCart}
                        trend="+5.4%"
                        isUp={true}
                        color="text-info"
                    />
                    <MetricCard
                        label="Avg. Margin"
                        value={`${stats.summary.avgMargin.toFixed(1)}%`}
                        icon={Target}
                        trend="+1.2%"
                        isUp={true}
                        color="text-warning"
                    />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue & Profit Chart */}
                    <div className="lg:col-span-2 card">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <BarChart3 size={18} className="text-accent" />
                                    Growth Trends
                                </h3>
                                <p className="text-xs text-muted-foreground">Monthly revenue and profit performance</p>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Breakdown */}
                    <div className="card">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <ShoppingCart size={18} className="text-info" />
                                Fulfillment Status
                            </h3>
                            <p className="text-xs text-muted-foreground">Distribution of order statuses</p>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.statusData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 space-y-3">
                            {stats.statusData.map((s: any) => (
                                <div key={s.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                        <span className="text-xs font-medium text-muted-foreground">{s.name}</span>
                                    </div>
                                    <span className="text-xs font-bold">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ label, value, icon: Icon, trend, isUp, color }: any) {
    return (
        <div className="card group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg bg-bg-secondary group-hover:bg-accent/10 transition-colors", color.replace('text', 'bg').replace('success', 'success/10').replace('accent', 'accent/10').replace('info', 'info/10').replace('warning', 'warning/10'))}>
                    <Icon size={20} className={color} />
                </div>
                <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold", isUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <h4 className="text-2xl font-black mt-1 tracking-tight">{value}</h4>
            </div>
        </div>
    )
}
