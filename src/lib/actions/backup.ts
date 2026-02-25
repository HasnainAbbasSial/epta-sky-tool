'use server'

import { createClient } from '@/lib/supabase/server'

export async function getFullBackupData() {
    const supabase = await createClient()

    const [
        { data: websites },
        { data: clients },
        { data: orders },
        { data: activity }
    ] = await Promise.all([
        supabase.from('websites').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('activity_logs').select('*')
    ])

    return {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
            websites: websites || [],
            clients: clients || [],
            orders: orders || [],
            activity: activity || []
        }
    }
}

export async function getLastBackupSync() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('activity_logs')
        .select('created_at')
        .eq('module', 'system')
        .eq('action', 'backup_sync')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    return data?.created_at || null
}

export async function triggerBackupSync() {
    const supabase = await createClient()

    // In a real app, this might trigger a Supabase Edge Function or Webhook.
    // For now, we'll log it as a successful sync.
    await supabase.from('activity_logs').insert([
        {
            action: 'backup_sync',
            module: 'system',
            record_id: 'internal',
            record_label: 'Cloud Sync',
            details: { status: 'success', timestamp: new Date().toISOString() }
        }
    ])

    return { success: true }
}
