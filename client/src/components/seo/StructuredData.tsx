import React from 'react';

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

export default StructuredData;
