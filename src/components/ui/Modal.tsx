'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleEscape)
        }
        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={cn(
                    "relative w-full max-w-2xl bg-bg-primary rounded-2xl shadow-2xl border border-border animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 overflow-hidden flex flex-col max-h-[90vh]",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-secondary/30">
                    <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-bg-hover text-muted-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
