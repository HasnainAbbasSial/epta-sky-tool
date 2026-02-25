'use client'

import { cn, formatCurrency } from '@/lib/utils'
import { getDashboardStats } from '@/lib/actions/dashboard'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Dashboard"
          subtitle="Loading your business statistics..."
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner w-12 h-12" />
        </div>
      </div>
    )
  }

  const { stats, recentActivity } = data

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
            color="bg-accent-subtle text-accent"
          />
          <StatsCard
            title="Total Clients"
            value={stats.totalClients?.toLocaleString()}
            label="Registered CRM"
            icon={Users}
            trend="up"
            color="bg-success-subtle text-success"
          />
          <StatsCard
            title="Total Profit (Life)"
            value={formatCurrency(stats.monthlyProfit)}
            label="From all completed"
            icon={TrendingUp}
            trend="up"
            color="bg-warning-subtle text-warning"
          />
          <StatsCard
            title="Active Orders"
            value={stats.totalOrders?.toLocaleString()}
            label="Tracking now"
            icon={ShoppingCart}
            trend="up"
            color="bg-info-subtle text-info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue & Profit Overview</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-[10px] text-muted-foreground">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-[10px] text-muted-foreground">Profit</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg bg-bg-secondary/50">
                <p className="text-sm text-muted-foreground italic">Chart will be rendered here once you have historical data.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="card-title mb-4">Top Performing Sites</h3>
                <div className="space-y-4">
                  {stats.totalWebsites === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No websites in inventory yet.</p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Waiting for more order data to calculate performance.</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title mb-4">Category Distribution</h3>
                <div className="h-[180px] flex items-center justify-center border border-dashed border-border rounded-lg bg-bg-secondary/50 mb-4">
                  <p className="text-xs text-muted-foreground italic">Collecting categorical data...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card border-l-4 border-l-warning">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-warning" />
                <h3 className="card-title">Urgent Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-bg-hover border border-border">
                  <p className="text-xs font-semibold text-info mb-1">Welcome!</p>
                  <p className="text-xs text-text-secondary leading-relaxed">System is now connected to live Supabase database.</p>
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
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0 shadow-glow" />
                      <div>
                        <p className="text-xs text-text-primary">
                          <span className="font-bold">{act.user_email || 'System'}</span> {act.action === 'create' ? 'added' : act.action} <span className="text-accent underline cursor-pointer">{act.record_label}</span> in {act.module}
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
    <div className="stat-card">
      <div className={cn("stat-card-icon", color)}>
        <Icon size={20} />
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{title}</div>
      <div className={cn("stat-card-change", trend === 'up' ? 'up' : 'down')}>
        {trend === 'up' ? <ArrowUpRight className="inline w-3 h-3 mr-0.5" /> : <ArrowDownRight className="inline w-3 h-3 mr-0.5" />}
        {label}
      </div>
    </div>
  )
}
