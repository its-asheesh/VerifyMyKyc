import React, { useEffect } from 'react';

// -----------------------------------------------------------------------------
// StructuredData Component
// -----------------------------------------------------------------------------
interface StructuredDataProps {
    type: 'organization' | 'website' | 'service' | 'breadcrumb' | 'faq' | 'article' | 'product';
    data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
    const getStructuredData = () => {
        const baseData = {
            "@context": "https://schema.org",
            ...data
        };

        switch (type) {
            case 'organization':
                return {
                    ...baseData,
                    "@type": "Organization",
                    "name": data.name || "VerifyMyKYC",
                    "url": data.url || "https://verifymykyc.com",
                    "logo": data.logo || "https://verifymykyc.com/verifymykyclogo.svg",
                    "description": data.description || "India's leading KYC and identity verification platform",
                    "foundingDate": data.foundingDate || "2020",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "New Delhi",
                        "addressCountry": "IN"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-9560652708",
                        "contactType": "customer service",
                        "areaServed": "IN",
                        "availableLanguage": ["English", "Hindi"]
                    }
                };

            case 'website':
                return {
                    ...baseData,
                    "@type": "WebSite",
                    "name": data.name || "VerifyMyKYC",
                    "url": data.url || "https://verifymykyc.com",
                    "description": data.description || "India's leading KYC and identity verification platform",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://verifymykyc.com/search?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                };

            case 'service':
                return {
                    ...baseData,
                    "@type": "Service",
                    "name": data.name,
                    "description": data.description,
                    "provider": {
                        "@type": "Organization",
                        "name": "VerifyMyKYC",
                        "url": "https://verifymykyc.com"
                    },
                    "areaServed": "IN",
                    "serviceType": data.serviceType || "KYC Verification"
                };

            case 'product':
                return {
                    ...baseData,
                    "@type": "Product",
                    "name": data.name,
                    "description": data.description,
                    "brand": {
                        "@type": "Brand",
                        "name": "VerifyMyKYC"
                    },
                    "category": data.category || "KYC Verification Service",
                    "offers": {
                        "@type": "Offer",
                        "price": data.price || "0",
                        "priceCurrency": "INR",
                        "availability": "https://schema.org/InStock"
                    }
                };

            case 'breadcrumb':
                return {
                    ...baseData,
                    "@type": "BreadcrumbList",
                    "itemListElement": data.items.map((item: any, index: number) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.name,
                        "item": item.url
                    }))
                };

            case 'faq':
                return {
                    ...baseData,
                    "@type": "FAQPage",
                    "mainEntity": data.questions.map((q: any) => ({
                        "@type": "Question",
                        "name": q.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": q.answer
                        }
                    }))
                };

            case 'article':
                return {
                    ...baseData,
                    "@type": "Article",
                    "headline": data.headline,
                    "description": data.description,
                    "author": {
                        "@type": "Organization",
                        "name": "VerifyMyKYC"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "VerifyMyKYC",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://verifymykyc.com/verifymykyclogo.svg"
                        }
                    },
                    "datePublished": data.datePublished,
                    "dateModified": data.dateModified || data.datePublished
                };

            default:
                return baseData;
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(getStructuredData(), null, 2)
            }}
        />
    );
};

// -----------------------------------------------------------------------------
// PerformanceOptimizations Component
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// SEOHead Component
// -----------------------------------------------------------------------------
interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    structuredData?: object;
    noIndex?: boolean;
    noFollow?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
    title = "VerifyMyKYC - India's Leading KYC & Identity Verification Platform",
    description = "VerifyMyKYC provides instant identity verification services including Aadhaar, PAN, Driving License, Passport, GSTIN verification and background checks. Trusted by 10,000+ users across India.",
    keywords = "KYC verification, identity verification, Aadhaar verification, PAN verification, driving license verification, passport verification, GSTIN verification, background check, India",
    canonicalUrl,
    ogImage = "/verifymykyclogo.svg",
    ogType = "website",
    twitterCard = "summary_large_image",
    structuredData,
    noIndex = false,
    noFollow = false,
}) => {
    const baseUrl = "https://verifymykyc.com";
    const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Helper function to update or create meta tag
        const updateMetaTag = (name: string, content: string, isProperty: boolean = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Helper function to update or create link tag
        const updateLinkTag = (rel: string, href: string) => {
            let link = document.querySelector(`link[rel="${rel}"]`);
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', rel);
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        // Basic Meta Tags
        if (description) updateMetaTag('description', description);
        if (keywords) updateMetaTag('keywords', keywords);
        updateMetaTag('author', 'VerifyMyKYC');
        updateMetaTag('robots', `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`);

        // Canonical URL
        if (fullCanonicalUrl) {
            updateLinkTag('canonical', fullCanonicalUrl);
        }

        // Open Graph Meta Tags
        updateMetaTag('og:title', title, true);
        if (description) updateMetaTag('og:description', description, true);
        updateMetaTag('og:type', ogType, true);
        updateMetaTag('og:url', fullCanonicalUrl, true);
        updateMetaTag('og:image', fullOgImage, true);
        updateMetaTag('og:image:width', '1200', true);
        updateMetaTag('og:image:height', '630', true);
        updateMetaTag('og:site_name', 'VerifyMyKYC', true);
        updateMetaTag('og:locale', 'en_IN', true);

        // Twitter Card Meta Tags
        updateMetaTag('twitter:card', twitterCard);
        updateMetaTag('twitter:title', title);
        if (description) updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', fullOgImage);
        updateMetaTag('twitter:site', '@VerifyMyKYC');
        updateMetaTag('twitter:creator', '@VerifyMyKYC');

        // Additional SEO Meta Tags
        updateMetaTag('theme-color', '#2563eb');
        updateMetaTag('msapplication-TileColor', '#2563eb');
        updateMetaTag('apple-mobile-web-app-capable', 'yes');
        updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
        updateMetaTag('apple-mobile-web-app-title', 'VerifyMyKYC');

        // Geo Tags for India
        updateMetaTag('geo.region', 'IN');
        updateMetaTag('geo.country', 'India');
        updateMetaTag('geo.placename', 'New Delhi');

        // Business Information
        updateMetaTag('business:contact_data:locality', 'New Delhi');
        updateMetaTag('business:contact_data:country_name', 'India');

        // Structured Data
        if (structuredData) {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        } else {
            // Default Organization structured data for better SEO
            const defaultStructuredData = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "VerifyMyKYC",
                "url": "https://verifymykyc.com",
                "logo": `${baseUrl}/verifymykyclogo.svg`,
                "description": description,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "New Delhi",
                    "addressCountry": "IN"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Service",
                    "areaServed": "IN",
                    "availableLanguage": ["English", "Hindi"]
                },
                "sameAs": [
                    "https://www.linkedin.com/company/verifymykyc",
                    "https://twitter.com/VerifyMyKYC"
                ],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "1000",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            };

            let script = document.querySelector('script[type="application/ld+json"]#default-structured-data');
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                script.setAttribute('id', 'default-structured-data');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(defaultStructuredData);
        }

        // Add hreflang tags for better international SEO (if needed)
        // updateLinkTag('alternate', fullCanonicalUrl + '?lang=en');

        // Add preconnect for performance
        const preconnectGoogle = document.querySelector('link[rel="preconnect"][href="https://www.google.com"]');
        if (!preconnectGoogle) {
            const preconnect = document.createElement('link');
            preconnect.setAttribute('rel', 'preconnect');
            preconnect.setAttribute('href', 'https://www.google.com');
            document.head.appendChild(preconnect);
        }

        // Cleanup function to restore defaults (optional)
        return () => {
            // Optionally restore default title
            document.title = "VerifyMyKYC - India's Leading KYC & Identity Verification Platform";
        };
    }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, structuredData, noIndex, noFollow]);

    // This component doesn't render anything
    return null;
};

export default SEOHead;
