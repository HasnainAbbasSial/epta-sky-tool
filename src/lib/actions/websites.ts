'use server'

import { createClient } from '@/lib/supabase/server'
import { WebsiteFormData } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function createWebsite(data: WebsiteFormData) {
    const supabase = await createClient()

    // 1. Check for duplicates
    const { data: existing } = await supabase
        .from('websites')
        .select('id')
        .eq('website_url', data.website_url)
        .single()

    if (existing) {
        throw new Error('This website URL already exists in the inventory.')
    }

    // 2. Insert new website
    const { data: inserted, error } = await supabase
        .from('websites')
        .insert([
            {
                ...data,
                last_price_updated: new Date().toISOString(),
                price_history: [
                    {
                        date: new Date().toISOString(),
                        gp: data.gp_price,
                        li: data.li_price,
                        homepage: data.homepage_price,
                        secondary: data.secondary_price,
                        currency: data.currency
                    }
                ]
            }
        ])
        .select()
        .single()

    if (error) {
        console.error('Error creating website:', error)
        throw new Error(error.message)
    }

    // 3. Log Activity
    await supabase.from('activity_logs').insert([
        {
            action: 'create',
            module: 'websites',
            record_id: inserted.id,
            record_label: inserted.website_url,
            details: { url: inserted.website_url, name: inserted.website_name }
        }
    ])

    revalidatePath('/websites')
    revalidatePath('/')

    return inserted
}

export async function getWebsites(filters?: any) {
    const supabase = await createClient()

    let query = supabase
        .from('websites')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

    if (filters?.search) {
        query = query.or(`website_url.ilike.%${filters.search}%,website_name.ilike.%${filters.search}%`)
    }

    if (filters?.category && filters.category !== 'all') {
        query = query.contains('categories', [filters.category])
    }

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching websites:', error)
        return []
    }

    return data
}

export async function deleteWebsite(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/websites')
    revalidatePath('/')
}
