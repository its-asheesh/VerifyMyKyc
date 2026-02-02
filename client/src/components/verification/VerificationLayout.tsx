"use client"

import React, { useState } from "react"
import { cn } from "../../lib/utils"
import { CheckCircle2, ShieldCheck } from "lucide-react"

interface ServiceMeta {
    key: string;
    name: string;
    description: string;
}

interface VerificationLayoutProps<T extends ServiceMeta> {
    title: string
    description: string
    services: T[]
    selectedService: T
    onServiceChange: (service: T) => void
    children: React.ReactNode
}

export const VerificationLayout = <T extends ServiceMeta>({
    title,
    description,
    services,
    selectedService,
    onServiceChange,
    children,
}: VerificationLayoutProps<T>) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Mobile Header with Burger Menu */}
            <div className="lg:hidden flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    </div>
                </div>
            </div>

            {/* Desktop Title */}
            <div className="hidden lg:flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-500">{description}</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    {/* Desktop Sidebar (Visible on LG+) */}
                    <div className="hidden lg:block lg:col-span-4 h-full overflow-y-auto pb-20 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 sticky top-0">
                            {services.map((service) => (
                                <button
                                    key={service.key}
                                    onClick={() => onServiceChange(service)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 last:mb-0 block",
                                        selectedService.key === service.key
                                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                                            : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent",
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate font-semibold">{service.name}</span>
                                        {selectedService.key === service.key && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />}
                                    </div>
                                    {service.description && (
                                        <p className={cn("text-xs mt-1 line-clamp-2", selectedService.key === service.key ? "text-blue-600/80" : "text-gray-500")}>
                                            {service.description}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Security Badge in Sidebar */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 mt-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-green-100 rounded-full">
                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Secure Platform</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Your data is encrypted with 256-bit SSL security. We do not store sensitive documents.
                            </p>
                        </div>
                    </div>

                    {/* Mobile Sidebar (Drawer) */}
                    {/* Overlay */}
                    <div
                        className={cn(
                            "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
                            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Drawer */}
                    <div className={cn(
                        "fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden transform transition-transform duration-300 shadow-2xl flex flex-col",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-lg text-gray-900">Select Service</span>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {services.map((service) => (
                                <button
                                    key={service.key}
                                    onClick={() => {
                                        onServiceChange(service);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors block",
                                        selectedService.key === service.key
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50",
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate font-semibold">{service.name}</span>
                                        {selectedService.key === service.key && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />}
                                    </div>
                                    {service.description && (
                                        <p className={cn("text-xs mt-1 line-clamp-2", selectedService.key === service.key ? "text-blue-600/80" : "text-gray-500")}>
                                            {service.description}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 h-full overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 min-h-[500px]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
