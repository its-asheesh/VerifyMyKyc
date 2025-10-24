// Core utilities for data export functionality
export interface ExportColumn {
  key: string
  label: string
  formatter?: (value: any) => string
}

export interface ExportOptions {
  filename?: string
  includeTimestamp?: boolean
  sheetName?: string
}

// Escape HTML characters for safe export
export const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Export data to Excel format (.xls)
export const exportToExcel = (
  data: any[],
  columns: ExportColumn[],
  options: ExportOptions = {}
): void => {
  try {
    const { filename = 'export', includeTimestamp = true, sheetName = 'Sheet1' } = options
    
    // Generate headers
    const headers = columns.map(col => col.label)
    
    // Generate rows
    const rowsHtml = data
      .map(item => {
        const cells = columns
          .map(col => {
            const value = item[col.key]
            const formattedValue = col.formatter ? col.formatter(value) : String(value ?? '')
            return `<td>${escapeHtml(formattedValue)}</td>`
          })
          .join('')
        return `<tr>${cells}</tr>`
      })
      .join('')

    // Generate header row
    const headerHtml = `<tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`
    
    // Create HTML table
    const tableHtml = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${sheetName}</title>
        </head>
        <body>
          <table>
            <thead>${headerHtml}</thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>`

    // Create and download file
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    const finalFilename = includeTimestamp 
      ? `${filename}_${generateTimestamp()}.xls`
      : `${filename}.xls`
    
    link.href = url
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export data:', error)
    throw new Error('Export failed. Please try again.')
  }
}

// Export data to CSV format
export const exportToCSV = (
  data: any[],
  columns: ExportColumn[],
  options: ExportOptions = {}
): void => {
  try {
    const { filename = 'export', includeTimestamp = true } = options
    
    // Generate headers
    const headers = columns.map(col => col.label)
    
    // Generate rows
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key]
        const formattedValue = col.formatter ? col.formatter(value) : String(value ?? '')
        // Escape CSV values (wrap in quotes if contains comma, quote, or newline)
        return formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')
          ? `"${formattedValue.replace(/"/g, '""')}"`
          : formattedValue
      }).join(',')
    )
    
    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    const finalFilename = includeTimestamp 
      ? `${filename}_${generateTimestamp()}.csv`
      : `${filename}.csv`
    
    link.href = url
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export CSV:', error)
    throw new Error('CSV export failed. Please try again.')
  }
}

// Generate timestamp for file names (reused from dateUtils)
const generateTimestamp = (): string => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
}

// Common formatters for different data types
export const formatters = {
  currency: (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return '₹0.00'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value)
  },
  
  date: (value: string | Date) => {
    if (!value) return ''
    const date = typeof value === 'string' ? new Date(value) : value
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },
  
  datetime: (value: string | Date) => {
    if (!value) return ''
    const dateValue = typeof value === 'string' ? new Date(value) : value
    return dateValue.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
  
  boolean: (value: boolean | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    return value ? 'Yes' : 'No'
  },
  
  status: (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'Active' : 'Inactive'
    }
    return value || 'N/A'
  },
  
  number: (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return '0'
    return new Intl.NumberFormat('en-IN').format(value)
  }
}
