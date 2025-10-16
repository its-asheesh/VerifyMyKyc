// src/components/auth/AuthSideIllustration.tsx
import React from 'react'
import Lottie from 'lottie-react'

interface Props {
  animationData: object
  className?: string
}

const AuthSideIllustration: React.FC<Props> = ({ animationData, className }) => {
  return (
    <div className={`hidden lg:flex items-center justify-center px-8 pt-8 pb-4 h-full ${className || ''}`}>
      <div
        className="w-full h-full"
        style={{
          WebkitMaskImage: 'radial-gradient(80% 80% at 50% 50%, black 70%, transparent 100%)',
          maskImage: 'radial-gradient(80% 80% at 50% 50%, black 70%, transparent 100%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%'
        }}
      >
        <Lottie animationData={animationData as any} loop autoplay style={{ width: '100%', height: '100%', maxHeight: 500 }} />
      </div>
    </div>
  )
}

export default AuthSideIllustration


