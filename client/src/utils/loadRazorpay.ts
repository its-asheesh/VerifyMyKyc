declare global {
  interface Window {
    Razorpay: unknown
  }
}

export const loadRazorpay = (): Promise<unknown> => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => {
      alert('Failed to load payment gateway. Please try again.')
      resolve(null)
    }
    document.body.appendChild(script)
  })
}
