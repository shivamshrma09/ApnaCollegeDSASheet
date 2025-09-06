import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHelmet = ({ 
  title = "+DSA | PlusDSA - Code Your Way to Success",
  description = "Code Your Way to Success with India's smartest DSA platform! 373+ problems, smart progress tracking, daily challenges.",
  keywords = "+DSA, PlusDSA, DSA practice, coding interview, FAANG prep",
  image = "https://plusdsa.vercel.app/og-image.jpg",
  type = "website"
}) => {
  const location = useLocation();
  const currentUrl = `https://plusdsa.vercel.app${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const updateMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      }
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:url', currentUrl);
    updateMeta('og:image', image);
    updateMeta('og:type', type);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    }

    // Add structured data for current page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "+DSA | PlusDSA",
        "url": "https://plusdsa.vercel.app"
      }
    };

    let script = document.querySelector('#page-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'page-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, type, currentUrl]);

  return null;
};

export default SEOHelmet;