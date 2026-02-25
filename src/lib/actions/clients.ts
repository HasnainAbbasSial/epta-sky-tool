'use server'

import { createClient } from '@/lib/supabase/server'
import { ClientFormData } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function createClientRecord(data: ClientFormData) {
    const supabase = await createClient()

    const { data: inserted, error } = await supabase
        .from('clients')
        .insert([data])
        .select()
        .single()

    if (error) {
        console.error('Error creating client:', error)
        throw new Error(error.message)
    }

    // Log Activity
    await supabase.from('activity_logs').insert([
        {
            action: 'create',
            module: 'clients',
            record_id: inserted.id,
            record_label: inserted.name,
            details: { name: inserted.name, company: inserted.company_name }
        }
    ])

    revalidatePath('/clients')
    revalidatePath('/')

    return inserted
}

export async function getClients(search?: string) {
    const supabase = await createClient()

    let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

    if (search) {
        query = query.or(`name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching clients:', error)
        return []
    }

    return data
}

export async function updateClientRecord(id: string, data: ClientFormData) {
    const supabase = await createClient()

    const { data: updated, error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error

    // Log Activity
    await supabase.from('activity_logs').insert([
        {
            action: 'update',
            module: 'clients',
            record_id: id,
            record_label: updated.name,
            details: { name: updated.name, company: updated.company_name }
        }
    ])

    revalidatePath('/clients')
    revalidatePath('/')

    return updated
}

export async function deleteClient(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/clients')
    revalidatePath('/')
}
