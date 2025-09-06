import { useEffect } from 'react';

const SEOHead = ({ 
  title = "DSA Sheet - Apna College | Complete Data Structures & Algorithms Practice Platform",
  description = "Master Data Structures & Algorithms with our comprehensive DSA practice platform. 373+ curated problems, progress tracking, mentorship, and interview preparation.",
  keywords = "DSA, Data Structures, Algorithms, Coding Interview, LeetCode, Programming, Computer Science, Software Engineering, Apna College",
  canonical = "",
  ogImage = "/og-image.jpg"
}) => {
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
    updateMeta('og:image', ogImage);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    
    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      }
    }
  }, [title, description, keywords, canonical, ogImage]);

  return null;
};

export default SEOHead;