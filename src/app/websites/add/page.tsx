'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { WebsiteForm } from '@/components/inventory/WebsiteForm'
import { toast } from 'sonner'
import { useState } from 'react'
import { createWebsite } from '@/lib/actions/websites'

export default function AddWebsitePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            await createWebsite(data)

            toast.success('Website added successfully!', {
                description: `${data.website_url} has been saved to inventory.`,
            })

            router.push('/websites')
        } catch (error: any) {
            toast.error(error.message || 'Failed to add website. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Inventory / Add Website"
                subtitle="Register a new publisher website in the system."
            />

            <div className="page-body max-w-5xl mx-auto w-full">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Add New Website</h1>
                        <p className="text-muted-foreground italic text-sm">
                            Fill in all required details to ensure high-quality tracking and filtering.
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent-subtle flex items-center justify-center text-accent">
                        <span className="font-bold text-lg">?</span>
                    </div>
                </div>

                <WebsiteForm
                    onCancel={() => router.push('/websites')}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />

                <div className="mt-12 mb-8 p-6 rounded-xl border border-dashed border-border bg-bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Integration Preview</p>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                        Once saved, this website will be checked for domain duplication and SEO metrics will be verified against historical data.
                    </p>
                </div>
            </div>
        </div>
    )
}
