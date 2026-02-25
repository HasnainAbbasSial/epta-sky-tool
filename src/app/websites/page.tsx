import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import {
    Plus,
    Search,
    Filter,
    Download,
    MoreVertical,
    Star,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Edit,
    Trash2
} from 'lucide-react'
import {
    cn,
    formatCurrency,
    formatNumber,
    getDaColor,
    getDrColor,
    getSpamColor,
    getStatusBadgeClass
} from '@/lib/utils'
import { CATEGORIES, Website, WebsiteFormData } from '@/lib/types'
import { getWebsites, updateWebsite, deleteWebsite } from '@/lib/actions/websites'
import { Modal } from '@/components/ui/Modal'
import { WebsiteForm } from '@/components/inventory/WebsiteForm'
import { toast } from 'sonner'

export default function WebsitesPage() {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [websites, setWebsites] = useState<Website[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal states
    const [editingWebsite, setEditingWebsite] = useState<Website | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchSites = async () => {
        setIsLoading(true)
        try {
            const data = await getWebsites({
                search,
                category: selectedCategory === 'All' ? 'all' : selectedCategory
            })
            setWebsites(data as any)
        } catch (error) {
            toast.error('Failed to fetch inventory')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(fetchSites, 300)
        return () => clearTimeout(timer)
    }, [search, selectedCategory])

    const handleEditWebsite = async (data: WebsiteFormData) => {
        if (!editingWebsite) return
        setIsSubmitting(true)
        const toastId = toast.loading('Updating website...')
        try {
            await updateWebsite(editingWebsite.id, data)
            toast.success('Website updated successfully', { id: toastId })
            setEditingWebsite(null)
            fetchSites()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update website', { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteWebsite = async (id: string) => {
        if (!confirm('Are you sure you want to delete this website? This will also remove its order history reference.')) return
        setIsDeleting(id)
        const toastId = toast.loading('Deleting website...')
        try {
            await deleteWebsite(id)
            toast.success('Website deleted successfully', { id: toastId })
            fetchSites()
        } catch (error) {
            toast.error('Failed to delete website', { id: toastId })
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Website Inventory"
                subtitle="Manage and filter your publisher websites list."
            />

            <div className="page-body">
                {/* Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">Websites</h1>
                        <span className="badge badge-accent">{websites.length} Total</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="btn btn-secondary">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <Link href="/websites/add" className="btn btn-primary">
                            <Plus className="w-4 h-4" />
                            Add Website
                        </Link>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="search-wrapper max-w-sm">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search domain, name, niche..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            className="form-select text-xs h-9 min-w-[140px]"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Sort by:</span>
                        <select className="form-select text-xs h-9 border-none bg-transparent font-semibold pr-8 cursor-pointer">
                            <option>DA (High to Low)</option>
                            <option>Price (Low to High)</option>
                            <option>Traffic (High to Low)</option>
                            <option>Newest Added</option>
                        </select>
                    </div>
                </div>

                {/* Table Area */}
                <div className="table-wrapper relative min-h-[400px]">
                    {(isLoading || isDeleting) && (
                        <div className="absolute inset-0 bg-bg-primary/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                            <div className="spinner w-8 h-8" />
                        </div>
                    )}

                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="w-10">
                                    <input type="checkbox" className="rounded border-border bg-bg-secondary" />
                                </th>
                                <th>Website</th>
                                <th>SEO Stats</th>
                                <th>Category / Type</th>
                                <th>Pricing (USD)</th>
                                <th>Status</th>
                                <th>TAT</th>
                                <th className="w-10 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && websites.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-24">
                                        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                                            <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-4 text-muted-foreground/30">
                                                <Search size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold mb-1">No websites found</h3>
                                            <p className="text-sm text-muted-foreground">We couldn't find any publisher sites matching your current filters or search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {websites.map((site) => (
                                <tr key={site.id} className="group">
                                    <td>
                                        <input type="checkbox" className="rounded border-border bg-bg-secondary" />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-9 h-9 rounded-lg bg-bg-hover flex items-center justify-center text-accent font-bold text-xs border border-border uppercase">
                                                    {site.website_url?.charAt(0)}
                                                </div>
                                                {site.is_pinned && (
                                                    <div className="absolute -top-1 -left-1 text-gold">
                                                        <Star className="w-3 h-3 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold text-text-primary">{site.website_url}</span>
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-accent" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="star-rating">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <Star
                                                                key={star}
                                                                className={cn("w-2.5 h-2.5", star <= (site.internal_rating || 0) ? "fill-gold text-gold" : "text-muted-foreground")}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{site.language}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">DA/DR</p>
                                                <p className="text-xs font-bold">
                                                    <span className={getDaColor(site.da!)}>{site.da || 0}</span>
                                                    <span className="text-muted-foreground mx-1">/</span>
                                                    <span className={getDrColor(site.dr!)}>{site.dr || 0}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Traffic</p>
                                                <p className="text-xs font-bold text-info">{formatNumber(site.organic_traffic)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Spam</p>
                                                <p className={cn("text-xs font-bold", getSpamColor(site.spam_score!))}>{site.spam_score || 0}%</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-wrap gap-1">
                                                {site.categories?.slice(0, 2).map(cat => (
                                                    <span key={cat} className="badge badge-accent py-0 px-1.5 h-4 text-[9px]">{cat}</span>
                                                ))}
                                            </div>
                                            <span className="text-[10px] lowercase text-muted-foreground italic">
                                                {site.type?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-4 text-xs">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground mb-0.5 italic">GP</p>
                                                <p className="font-bold text-success">{formatCurrency(site.gp_price)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground mb-0.5 italic">LI</p>
                                                <p className="font-bold text-info">{formatCurrency(site.li_price)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={cn("badge", getStatusBadgeClass(site.status!))}>
                                            {site.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                            {site.status === 'inactive' && <XCircle className="w-3 h-3 mr-1" />}
                                            {site.status === 'blacklisted' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                            {site.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-xs">
                                            <p className="font-bold text-text-secondary">{site.tat_days || '?'} Days</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">{site.link_type || 'dofollow'}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="btn-icon btn-ghost btn-sm"
                                                onClick={() => setEditingWebsite(site)}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn-icon btn-ghost btn-sm text-danger hover:bg-danger/10"
                                                onClick={() => handleDeleteWebsite(site.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="flex items-center justify-between mt-6">
                    <p className="text-xs text-muted-foreground">
                        Showing <span className="font-bold text-text-primary">1 - {websites.length}</span> of <span className="font-bold text-text-primary">{websites.length}</span> results
                    </p>
                    <div className="pagination">
                        <button className="page-btn" disabled>&lt;</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn" disabled>&gt;</button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingWebsite}
                onClose={() => setEditingWebsite(null)}
                title="Edit Website Details"
                className="max-w-4xl"
            >
                {editingWebsite && (
                    <WebsiteForm
                        initialData={editingWebsite}
                        onCancel={() => setEditingWebsite(null)}
                        onSubmit={handleEditWebsite}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    )
}
