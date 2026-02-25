'use client'

import { Header } from '@/components/layout/Header'
import { BarChart3, TrendingUp, Users, Globe, Download, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Reporting & Analytics"
                subtitle="Deep dive into your guest posting performance and business growth."
            />

            <div className="page-body">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary text-xs h-9">
                            <Calendar className="w-3.5 h-3.5" />
                            Last 12 Months
                        </button>
                        <button className="btn btn-primary text-xs h-9">
                            <Download className="w-3.5 h-3.5" />
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="card h-[350px] flex flex-col">
                        <h3 className="card-title mb-1">Revenue vs Profit Growth</h3>
                        <p className="text-xs text-muted-foreground mb-4">Comparison of gross income and net profit over time.</p>
                        <div className="flex-1 border border-dashed border-border rounded-lg bg-bg-secondary/50 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground italic">Area Chart (Recharts)</p>
                        </div>
                    </div>
                    <div className="card h-[350px] flex flex-col">
                        <h3 className="card-title mb-1">Order Volume by Category</h3>
                        <p className="text-xs text-muted-foreground mb-4">Which niches are performing the best for your agency.</p>
                        <div className="flex-1 border border-dashed border-border rounded-lg bg-bg-secondary/50 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground italic">Bar Chart (Recharts)</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <h3 className="card-title mb-4">Top Clients by Revenue</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-hover transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-[10px] font-bold text-accent">C{i}</div>
                                        <span className="text-xs font-medium">Digital Pulse Agency</span>
                                    </div>
                                    <span className="text-xs font-bold text-success">$14,200</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title mb-4">Most Used Websites</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-hover transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-bg-hover flex items-center justify-center text-[10px] font-bold text-muted-foreground">{i}</div>
                                        <span className="text-xs font-medium">forbes.com</span>
                                    </div>
                                    <span className="text-xs font-bold text-info">42nd Order</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-title mb-4">Profit Margin Stats</h3>
                        <div className="flex flex-col items-center justify-center h-[120px]">
                            <p className="text-3xl font-extrabold text-text-primary">34.2%</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Average Margin</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">High Margin Category:</span>
                                <span className="text-success font-bold">Health (42%)</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Low Margin Category:</span>
                                <span className="text-danger font-bold">Finance (18%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
