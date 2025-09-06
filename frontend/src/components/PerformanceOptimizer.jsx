import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = ['/dark.png', '/light.png'];
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      // Intersection Observer for lazy loading
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    };

    // Service Worker registration for caching
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    };

    // Web Vitals tracking
    const trackWebVitals = () => {
      // Track Core Web Vitals for SEO
      try {
        import('web-vitals').then((webVitals) => {
          if (webVitals && typeof webVitals.getCLS === 'function') {
            webVitals.getCLS(console.log);
            webVitals.getFID && webVitals.getFID(console.log);
            webVitals.getFCP && webVitals.getFCP(console.log);
            webVitals.getLCP && webVitals.getLCP(console.log);
            webVitals.getTTFB && webVitals.getTTFB(console.log);
          }
        }).catch(error => {
          console.log('Web Vitals not available:', error);
        });
      } catch (error) {
        console.log('Web Vitals import failed:', error);
      }
    };

    preloadCriticalResources();
    lazyLoadResources();
    registerServiceWorker();
    trackWebVitals();

    // Cleanup
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;