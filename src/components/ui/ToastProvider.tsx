'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                },
            }}
        />
    )
}
