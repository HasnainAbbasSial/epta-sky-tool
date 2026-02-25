'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAppSettings() {
    const supabase = await createClient()

    // We'll store categories and payment methods in a dedicated settings table
    const { data, error } = await supabase
        .from('settings')
        .select('*')

    if (error) {
        // Fallback for demo/initial setup if table doesn't exist yet
        return {
            categories: ['Technology', 'Fashion', 'Health', 'Business', 'Finance', 'Education', 'Gaming'],
            paymentMethods: ['PayPal', 'Payoneer', 'Wise', 'Bank Transfer', 'Crypto']
        }
    }

    const categories = data.find(s => s.key === 'categories')?.value || []
    const paymentMethods = data.find(s => s.key === 'payment_methods')?.value || []

    return { categories, paymentMethods }
}

export async function updateAppSettings(key: string, value: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (error) throw error

    revalidatePath('/settings')
    return { success: true }
}

export async function updateProfile(data: { name: string, email: string }) {
    const supabase = await createClient()

    // Note: In a real app, this would update the auth.users or a profiles table
    // For now, we log it as an activity
    await supabase.from('activity_logs').insert([
        {
            action: 'update',
            module: 'settings',
            record_id: 'profile',
            record_label: data.name,
            details: { email: data.email, updated: true }
        }
    ])

    return { success: true }
}
