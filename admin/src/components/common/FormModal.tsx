import React from 'react'
import BaseModal from './BaseModal'

export interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  title: string
  children: React.ReactNode
  isLoading?: boolean
  submitLabel?: string
  cancelLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  isLoading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  size = 'md',
  className = ''
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoading) {
      onSubmit(e)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        
        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitLabel}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default FormModal
