import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity } from 'lucide-react'
import UserAnalyticsChart from './UserAnalyticsChart'

interface UserAnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    data: any
}

const UserAnalyticsModal: React.FC<UserAnalyticsModalProps> = ({
    isOpen,
    onClose,
    data
}) => {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-indigo-600" />
                            User Growth Analytics
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto">
                        <UserAnalyticsChart data={data} />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default UserAnalyticsModal
