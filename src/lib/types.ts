// ============================================================
// WEBSITE INVENTORY TYPES
// ============================================================
export type WebsiteType = 'general' | 'pure_niche'
export type LinkType = 'dofollow' | 'nofollow' | 'both'
export type WebsiteStatus = 'active' | 'inactive' | 'blacklisted'
export type TrafficSource = 'ahrefs' | 'semrush' | 'similarweb' | 'manual'
export type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP' | 'AED'
export type PaymentMethod = 'paypal' | 'wise' | 'bank_transfer' | 'crypto_usdt' | 'crypto_btc' | 'cash' | 'other'

export const CATEGORIES = [
    'Business', 'Finance', 'Health', 'Education', 'Technology', 'Fashion',
    'Travel', 'Lifestyle', 'Real Estate', 'Legal', 'Food', 'Sports',
    'Entertainment', 'Crypto', 'Gaming', 'Auto', 'Home & Garden',
    'Beauty', 'Parenting', 'News', 'Marketing', 'SaaS', 'Other'
] as const

export const TOP_COUNTRIES = [
    'US', 'UK', 'CA', 'AU', 'IN', 'DE', 'FR', 'PK', 'AE', 'SG',
    'NZ', 'IE', 'ZA', 'NG', 'PH', 'NL', 'ES', 'IT', 'BR', 'MX', 'Other'
] as const

export type Category = typeof CATEGORIES[number]
export type Country = typeof TOP_COUNTRIES[number]

export interface PriceHistoryEntry {
    date: string
    gp_price: number | null
    li_price: number | null
    homepage_price: number | null
    secondary_price: number | null
    changed_by: string
    note?: string
}

export interface Website {
    id: string
    // Basic Info
    website_url: string
    website_name: string
    type: WebsiteType
    categories: Category[]
    niche: string
    link_type: LinkType
    status: WebsiteStatus
    is_pinned: boolean
    internal_rating: number // 1-5
    tags: string[]
    language: string
    indexed_by_google: boolean

    // SEO Metrics
    da: number | null
    dr: number | null
    spam_score: number | null
    organic_traffic: number | null
    ahrefs_traffic: number | null
    semrush_traffic: number | null
    top_countries: Country[]
    traffic_source: TrafficSource

    // Pricing
    gp_price: number | null
    li_price: number | null
    homepage_price: number | null
    secondary_price: number | null
    currency: Currency
    last_price_updated: string | null
    price_history: PriceHistoryEntry[]

    // Publisher/Vendor Info
    publisher_name: string
    publisher_email: string
    publisher_whatsapp: string
    publisher_skype: string
    publisher_other_contact: string
    preferred_contact: string
    payment_method: PaymentMethod

    // Content Guidelines
    min_word_count: number | null
    tat_days: number | null
    sponsored_tag_allowed: boolean
    casino_allowed: boolean
    cbd_allowed: boolean
    adult_allowed: boolean
    max_external_links: number | null
    sample_post_url: string
    guidelines_notes: string

    // Stats
    times_ordered: number

    // Timestamps
    created_at: string
    updated_at: string
    created_by: string | null
}

export type WebsiteFormData = Omit<Website, 'id' | 'created_at' | 'updated_at' | 'times_ordered' | 'price_history'>

// ============================================================
// CLIENT CRM TYPES
// ============================================================
export type ClientStatus = 'active' | 'inactive' | 'vip'

export interface Client {
    id: string
    client_name: string
    client_email: string
    client_company: string
    client_whatsapp: string
    client_skype: string
    client_country: string
    client_status: ClientStatus
    preferred_niches: Category[]
    preferred_budget_min: number | null
    preferred_budget_max: number | null
    payment_method_history: PaymentMethod[]
    total_orders: number
    total_spent: number
    notes: string
    created_at: string
    updated_at: string
    created_by: string | null
}

export type ClientFormData = Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_spent'>

// ============================================================
// ORDER / TRANSACTION TYPES
// ============================================================
export type OrderType = 'guest_post' | 'link_insertion' | 'homepage_link' | 'secondary_post'
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'partial' | 'paid'

export interface CurrencyHistoryEntry {
    date: string
    from_currency: Currency
    to_currency: Currency
    exchange_rate: number
    changed_by: string
}

export interface OrderDocument {
    id: string
    label: string
    url: string
    type: 'image' | 'pdf' | 'other'
    uploaded_at: string
}

export interface Order {
    id: string
    order_reference: string // ORD-2025-001
    client_id: string
    website_id: string

    // Client & Website snapshots (for historical accuracy)
    client_name_snapshot: string
    website_url_snapshot: string

    order_type: OrderType
    order_status: OrderStatus

    // Finance
    vendor_price: number
    client_price: number
    profit: number // auto-calculated
    profit_margin_pct: number // auto-calculated
    currency: Currency
    amount_in_usd: number
    exchange_rate_used: number
    exchange_rate_date: string | null
    currency_history: CurrencyHistoryEntry[]

    // Dates
    order_date: string
    delivery_date: string | null
    delivered_date: string | null
    tax_year: string // e.g. "2025"

    // Content
    post_url: string
    anchor_text: string
    target_url: string

    // Payment
    payment_status_client: PaymentStatus
    payment_status_vendor: PaymentStatus
    payment_method_client: PaymentMethod
    payment_method_vendor: PaymentMethod
    invoice_reference: string

    // Proofs & Files
    payment_proof_client?: string | null // file URL
    payment_proof_vendor?: string | null // file URL
    post_screenshot?: string | null
    invoice_file?: string | null
    order_documents: OrderDocument[]

    // Revisions & Refunds
    revision_requested: boolean
    revision_notes: string
    refund_issued: boolean
    refund_amount: number | null

    notes: string
    created_at: string
    updated_at: string
    created_by: string | null
}

export type OrderFormData = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'profit' | 'profit_margin_pct' | 'order_reference' | 'tax_year'>

// ============================================================
// EXPORT TEMPLATE TYPES
// ============================================================
export interface ExportTemplate {
    id: string
    name: string
    description: string
    module: 'websites' | 'orders' | 'clients'
    columns: string[]
    is_client_safe: boolean
    created_at: string
    created_by: string | null
}

// ============================================================
// ACTIVITY LOG TYPES
// ============================================================
export type ActivityAction = 'create' | 'edit' | 'delete' | 'export' | 'import' | 'login' | 'logout' | 'price_edit' | 'role_change' | 'bulk_delete' | 'backup' | 'restore' | 'upload'

export interface ActivityLog {
    id: string
    user_id: string | null
    user_email: string
    action: ActivityAction
    module: string
    record_id: string | null
    record_label: string | null
    details: Record<string, unknown>
    ip_address: string | null
    created_at: string
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================
export type NotificationSeverity = 'info' | 'warning' | 'critical'

export interface AppNotification {
    id: string
    title: string
    message: string
    severity: NotificationSeverity
    read: boolean
    module: string
    record_id: string | null
    created_at: string
}

// ============================================================
// BACKUP LOG TYPES
// ============================================================
export interface BackupLog {
    id: string
    file_name: string
    file_url: string
    file_size_bytes: number
    type: 'auto' | 'manual'
    created_by: string | null
    created_at: string
}

// ============================================================
// USER / ROLE TYPES
// ============================================================
export type UserRole = 'admin' | 'manager' | 'staff'

export interface AppUser {
    id: string
    email: string
    full_name: string
    role: UserRole
    is_active: boolean
    last_login: string | null
    failed_login_attempts: number
    created_at: string
}

// ============================================================
// FILTER TYPES
// ============================================================
export interface WebsiteFilters {
    search?: string
    type?: WebsiteType | ''
    categories?: Category[]
    link_type?: LinkType | ''
    status?: WebsiteStatus | ''
    da_min?: number | ''
    da_max?: number | ''
    dr_min?: number | ''
    dr_max?: number | ''
    spam_max?: number | ''
    traffic_min?: number | ''
    gp_price_min?: number | ''
    gp_price_max?: number | ''
    top_countries?: Country[]
    tat_max?: number | ''
    sponsored_allowed?: boolean | ''
    casino_allowed?: boolean | ''
    is_pinned?: boolean | ''
    internal_rating_min?: number | ''
    sort_by?: string
    sort_dir?: 'asc' | 'desc'
}

export interface OrderFilters {
    search?: string
    order_status?: OrderStatus | ''
    payment_status_client?: PaymentStatus | ''
    payment_status_vendor?: PaymentStatus | ''
    order_type?: OrderType | ''
    client_id?: string | ''
    website_id?: string | ''
    date_from?: string
    date_to?: string
    tax_year?: string | ''
    currency?: Currency | ''
    sort_by?: string
    sort_dir?: 'asc' | 'desc'
}

// ============================================================
// DASHBOARD TYPES
// ============================================================
export interface DashboardStats {
    total_websites: number
    active_websites: number
    inactive_websites: number
    blacklisted_websites: number
    total_clients: number
    active_clients: number
    vip_clients: number
    total_orders: number
    orders_this_month: number
    total_revenue: number
    revenue_this_month: number
    total_profit: number
    profit_this_month: number
    avg_profit_margin: number
    avg_da: number
    avg_dr: number
    pending_from_clients: number
    pending_to_vendors: number
    overdue_orders: number
}

export interface MonthlyStats {
    month: string
    revenue: number
    profit: number
    orders: number
}

export interface CategoryBreakdown {
    category: string
    count: number
    percentage: number
}

export interface TopWebsite {
    website_id: string
    website_url: string
    times_ordered: number
    total_revenue: number
}

export interface TopClient {
    client_id: string
    client_name: string
    total_orders: number
    total_spent: number
}
