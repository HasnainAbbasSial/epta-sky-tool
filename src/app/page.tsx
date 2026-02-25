'use client'

import { cn, formatCurrency } from '@/lib/utils'
import { getDashboardStats } from '@/lib/actions/dashboard'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Header } from '@/components/layout/Header'
import {
  Globe,
  Users,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  LineChart as ChartIcon
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardStats()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading || !data) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Dashboard"
          subtitle="Loading your business statistics..."
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner w-10 h-10" />
        </div>
      </div>
    )
  }

  const { stats, recentActivity, chartData } = data

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back, Admin. Here is what is happening today."
      />

      <div className="page-body">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Websites"
            value={stats.totalWebsites?.toLocaleString()}
            label="In Inventory"
            icon={Globe}
            trend="up"
            color="bg-accent/10 text-accent"
          />
          <StatsCard
            title="Total Clients"
            value={stats.totalClients?.toLocaleString()}
            label="Registered CRM"
            icon={Users}
            trend="up"
            color="bg-success/10 text-success"
          />
          <StatsCard
            title="Total Profit"
            value={formatCurrency(stats.monthlyProfit)}
            label="Life-time"
            icon={TrendingUp}
            trend="up"
            color="bg-warning/10 text-warning"
          />
          <StatsCard
            title="Active Orders"
            value={stats.totalOrders?.toLocaleString()}
            label="Tracking now"
            icon={ShoppingCart}
            trend="up"
            color="bg-info/10 text-info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header pb-6">
                <h3 className="card-title mt-0">Revenue & Profit Overview</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Profit</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dashProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#dashRevenue)" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#dashProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="card-title mb-4">Top Targets</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-bg-secondary border border-border border-dashed flex flex-col items-center justify-center text-center">
                    <ChartIcon size={32} className="text-muted-foreground opacity-20 mb-2" />
                    <p className="text-xs text-muted-foreground italic">Coming soon: Top websites by order volume.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center p-3 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border transition-colors">
                    < Globe size={16} className="text-accent mb-2" />
                    <span className="text-[10px] font-bold">New Site</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border transition-colors">
                    < Users size={16} className="text-success mb-2" />
                    <span className="text-[10px] font-bold">New Client</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border transition-colors">
                    < ShoppingCart size={16} className="text-info mb-2" />
                    <span className="text-[10px] font-bold">New Order</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border transition-colors">
                    < AlertCircle size={16} className="text-warning mb-2" />
                    <span className="text-[10px] font-bold">Log Event</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card border-l-4 border-l-warning">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-warning" />
                <h3 className="card-title">Notifications</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-bg-hover border border-border">
                  <p className="text-[10px] uppercase font-black text-info mb-1 tracking-tighter">System Live</p>
                  <p className="text-xs text-text-secondary leading-relaxed">Full CRUD operations are now active across all modules.</p>
                </div>
              </div>
            </div>

            <div className="card min-h-[300px]">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-accent" />
                <h3 className="card-title">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No recent activity found.</p>
                ) : (
                  recentActivity.map((act: any, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0 shadow-glow" />
                      <div>
                        <p className="text-[11px] leading-snug">
                          <span className="text-muted-foreground uppercase text-[9px] font-bold block mb-0.5">{act.module}</span>
                          <span className="font-bold text-accent">{act.action}</span> - {act.record_label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, label, icon: Icon, trend, color }: any) {
  return (
    <div className="stat-card group hover:scale-[1.03] transition-all duration-300 cursor-default">
      <div className={cn("stat-card-icon", color)}>
        <Icon size={20} />
      </div>
      <div className="mt-1">
        <div className="stat-card-value text-2xl font-black">{value}</div>
        <div className="stat-card-label text-[10px] font-bold text-muted-foreground uppercase mt-1">{title}</div>
      </div>
      <div className={cn("stat-card-change mt-2", trend === 'up' ? 'up' : 'down')}>
        {trend === 'up' ? <ArrowUpRight className="inline w-3 h-3 mr-0.5" /> : <ArrowDownRight className="inline w-3 h-3 mr-0.5" />}
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </div>
  )
}
