import React from 'react';

interface PerformanceOptimizationsProps {
  preloadImages?: string[];
  preloadFonts?: string[];
  criticalCSS?: string;
}

export const PerformanceOptimizations: React.FC<PerformanceOptimizationsProps> = ({
  preloadImages = [],
  preloadFonts = [],
  criticalCSS
}) => {
  return (
    <>
      {/* Preload critical images */}
      {preloadImages.map((image, index) => (
        <link
          key={`preload-image-${index}`}
          rel="preload"
          as="image"
          href={image}
          type="image/webp"
        />
      ))}

      {/* Preload critical fonts */}
      {preloadFonts.map((font, index) => (
        <link
          key={`preload-font-${index}`}
          rel="preload"
          as="font"
          href={font}
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}

      {/* Critical CSS inline */}
      {criticalCSS && (
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      )}

      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      <link rel="dns-prefetch" href="//www.clarity.ms" />
      <link rel="dns-prefetch" href="//cdn.taboola.com" />

      {/* Resource hints for better performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://connect.facebook.net" />
      <link rel="preconnect" href="https://www.clarity.ms" />
    </>
  );
};

export default PerformanceOptimizations;
