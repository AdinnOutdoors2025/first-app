import React, { useEffect, useRef, useMemo, useState } from 'react';
import './ScrollHero.css';

// Configuration and constants
const CONFIG = {
  IMAGE_BASE_PATH: '/images/',
  FALLBACK_IMAGE: '/images/placeholder.jpg',
  PRELOAD_THRESHOLD: 1
};

// Image data configuration - with centered text and button
const HERO_IMAGES_CONFIG = [
  {
    id: 1,
    src: "Caraousel_1.jpg",
    link: "/book",
    // text: "Own the moment, Own the attention",
    // buttonText: "Secure Spot",
    // Responsive images with graceful fallbacks
    responsive: {
      mobile: "Caraousel_1.jpg",
      tablet: "Caraousel_1.jpg",
      desktop: "Caraousel_1.jpg"
    }
  },
  {
    id: 2,
    src: "Caraousel_2.jpg",
    link: "/book",
    // text: "Own the moment,Own the attention",
    // buttonText: "Secure Spot",
    responsive: {
      mobile: "Caraousel_2.jpg",
      tablet: "Caraousel_2.jpg",
      desktop: "Caraousel_2.jpg"
    }
  },
  {
    id: 3,
    src: "Caraousel_3.jpg",
    link: "/book",
    // text: "Own the moment, Own the attention",
    // buttonText: "Secure Spot",
    responsive: {
      mobile: "Caraousel_3.jpg",
      tablet: "Caraousel_3.jpg",
      desktop: "Caraousel_3.jpg"
    }
  },
  {
    id: 4,
    src: "Caraousel_4.jpg",
    link: "/book",
    // text: "Own the moment, Own the attention",
    // buttonText: "Secure Spot",
    responsive: {
      mobile: "Caraousel_4.jpg",
      tablet: "Caraousel_4.jpg",
      desktop: "Caraousel_4.jpg"
    }
  }
];

/**
 * Processes image configuration to add full paths and validation
 * @param {Array} imageConfig - Raw image configuration
 * @returns {Array} Processed images with full paths
 */
const processImages = (imageConfig) => {
  return imageConfig.map(image => {
    // Validate required fields
    const requiredFields = ['id', 'src', 'title', 'subtitle'];
    const missingFields = requiredFields.filter(field => !image[field]);
    
    if (missingFields.length > 0) {
      console.warn(`Image with id ${image.id || 'unknown'} is missing fields: ${missingFields.join(', ')}`);
    }

    return {
      ...image,
      // Construct full image paths with error handling
      src: `${CONFIG.IMAGE_BASE_PATH}${image.src}`,
      // Create responsive image sources if available
      sources: image.responsive ? {
        mobile: `${CONFIG.IMAGE_BASE_PATH}${image.responsive.mobile}`,
        tablet: `${CONFIG.IMAGE_BASE_PATH}${image.responsive.tablet}`,
        desktop: `${CONFIG.IMAGE_BASE_PATH}${image.responsive.desktop}`
      } : null,
      // Ensure alt text is present for accessibility
      alt: image.alt || `${image.title || ''} - ${image.subtitle || ''}`
    };
  });
};

const ScrollHero = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  const videoRef = useRef(null);
const videoContainerRef = useRef(null);

  // Prevent click on slider drag
let touchStartX = 0;
let touchStartY = 0;
let moved = false;

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  moved = false;
};

const handleTouchMove = (e) => {
  const diffX = Math.abs(e.touches[0].clientX - touchStartX);
  const diffY = Math.abs(e.touches[0].clientY - touchStartY);

  // If finger moved more than 10px, treat as scroll/swipe
  if (diffX > 10 || diffY > 10) moved = true;
};

const handleTouchEnd = (url) => {
  if (!moved) {
    window.open(url, "_blank");
  }
};

// Desktop click
const handleClick = (url) => {
  window.open(url, "_blank");
};

  // Memoize processed images to prevent recreation on every render
  const heroImages = useMemo(() => processImages(HERO_IMAGES_CONFIG), []);
  
  // Preload critical images for better performance
  useEffect(() => {
    const preloadImages = () => {
      heroImages.slice(0, CONFIG.PRELOAD_THRESHOLD).forEach(image => {
        const img = new Image();
        img.src = image.src;
        
        // Handle load and error states
        img.onload = () => {
          setImageLoadStates(prev => ({ ...prev, [image.id]: true }));
        };
        
        img.onerror = () => {
          setErrorStates(prev => ({ ...prev, [image.id]: true }));
          console.warn(`Failed to load image: ${image.src}`);
        };
      });
    };

    preloadImages();
  }, [heroImages]);

  /**
   * Handles image loading errors with fallback
   * @param {Object} image - Image object
   * @param {Event} event - Error event
   */
  const handleImageError = (image, event) => {
    const img = event.target;
    
    // Only set fallback if not already using fallback
    if (img.src !== CONFIG.FALLBACK_IMAGE) {
      img.src = CONFIG.FALLBACK_IMAGE;
      setErrorStates(prev => ({ ...prev, [image.id]: true }));
    }
  };

  /**
   * Enhanced image rendering with responsive support and better error handling
   * @param {Object} image - Image object
   * @returns {JSX.Element} Image element
   */
  const renderImage = (image) => {
    const hasError = errorStates[image.id];
    const isLoaded = imageLoadStates[image.id];
    
    return (
      <div className="hero-image-container">
        <picture key={image.id}>
          {/* Responsive images with proper fallbacks */}
          <source 
            media="(max-width: 480px)" 
            srcSet={image.sources.mobile}
            onError={(e) => handleImageError(image, e)}
          />
          <source 
            media="(max-width: 768px)" 
            srcSet={image.sources.mobile}
            onError={(e) => handleImageError(image, e)}
          />
          <source 
            media="(max-width: 1024px)" 
            srcSet={image.sources.tablet}
            onError={(e) => handleImageError(image, e)}
          />
          <img 
            src={image.src} 
            alt={image.alt}
            className="hero-image"
            loading="eager" // Change to eager for critical above-the-fold images
            onLoad={() => setImageLoadStates(prev => ({ ...prev, [image.id]: true }))}
            onError={(e) => handleImageError(image, e)}
            style={{
              opacity: isLoaded && !hasError ? 1 : 0.3,
              transform: isLoaded && !hasError ? 'scale(1)' : 'scale(1.1)',
              transition: 'opacity 0.5s ease, transform 0.5s ease'
            }}
          />
        </picture>
        
        {/* Loading overlay */}
        {!isLoaded && !hasError && (
          <div className="image-loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {/* Error state */}
        {hasError && (
          <div className="image-error-overlay">
            <div className="error-content">
              <span>📷</span>
              <p>Image unavailable</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Ultra-smooth scroll handling with advanced optimization
  // useEffect(() => {
  //   let animationFrameId;
  //   let lastScrollY = 0;
  //   let isComponentMounted = true;
  //   let trackWidth = 0;
  //   let viewportWidth = 0;
  //   let containerHeight = 0;
  //   let windowHeight = 0;
  //   let startScroll = 0;
  //   let endScroll = 0;

  //   // Cache frequently used values
  //   const updateDimensions = () => {
  //     if (!containerRef.current || !trackRef.current) return;

  //     const container = containerRef.current;
  //     const rect = container.getBoundingClientRect();
  //     const track = trackRef.current;

  //     trackWidth = track.scrollWidth;
  //     viewportWidth = window.innerWidth;
  //     containerHeight = container.offsetHeight;
  //     windowHeight = window.innerHeight;
  //     startScroll = rect.top + window.scrollY;
  //     endScroll = startScroll + containerHeight - windowHeight;
  //   };

  //   // Smooth interpolation for better performance
  //   let currentTransform = 0;
  //   let targetTransform = 0;

  //   const handleScroll = () => {
  //     if (!isComponentMounted || !containerRef.current || !trackRef.current) return;

  //     const scrollY = window.scrollY;

  //     // Skip if no significant change (performance optimization)
  //     if (Math.abs(scrollY - lastScrollY) < 1 && !animationFrameId) {
  //       return;
  //     }
  //     lastScrollY = scrollY;

  //     // Throttle with requestAnimationFrame for smooth 60fps
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }

  //     animationFrameId = requestAnimationFrame(() => {
  //       if (!isComponentMounted || !containerRef.current || !trackRef.current) return;

  //       try {
  //         // Calculate scroll progress
  //         let percentage = 0;
          
  //         if (scrollY >= startScroll && scrollY <= endScroll) {
  //           const scrollDistance = scrollY - startScroll;
  //           const maxScroll = containerHeight - windowHeight;
  //           percentage = Math.max(0, Math.min(1, scrollDistance / maxScroll));
  //         } else if (scrollY > endScroll) {
  //           percentage = 1;
  //         } else {
  //           percentage = 0;
  //         }

  //         // Calculate target transform with smooth interpolation
  //         const maxMoveAmount = Math.max(0, trackWidth - viewportWidth);
  //         targetTransform = maxMoveAmount * percentage;

  //         // Smooth easing function for more natural movement
  //         const easeProgress = easeInOutCubic(percentage);
  //         const smoothTarget = maxMoveAmount * easeProgress;

  //         // Apply transform with sub-pixel precision
  //         currentTransform = smoothTarget;
  //         trackRef.current.style.transform = `translate3d(-${currentTransform}px, 0, 0)`;
          
  //       } catch (error) {
  //         console.error('Error in scroll handler:', error);
  //         trackRef.current.style.transform = 'translate3d(0, 0, 0)';
  //       }
  //     });
  //   };

  //   // Easing function for smoother animations
  //   const easeInOutCubic = (t) => {
  //     return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  //   };

  //   // Enhanced event listeners with better performance
  //   const scrollOptions = { passive: true };
  //   const resizeOptions = { passive: true };

  //   // Initial setup
  //   updateDimensions();
  //   handleScroll();

  //   // Event listeners
  //   window.addEventListener('scroll', handleScroll, scrollOptions);
  //   window.addEventListener('resize', () => {
  //     updateDimensions();
  //     handleScroll();
  //   }, resizeOptions);

  //   // Optimized resize handling
  //   let resizeTimeout;
  //   window.addEventListener('resize', () => {
  //     clearTimeout(resizeTimeout);
  //     resizeTimeout = setTimeout(() => {
  //       updateDimensions();
  //       handleScroll();
  //     }, 100);
  //   }, resizeOptions);

  //   // Initial calculation with proper DOM ready check
  //   const initScrollHandler = () => {
  //     if (document.readyState === 'complete') {
  //       updateDimensions();
  //       handleScroll();
  //     } else {
  //       setTimeout(initScrollHandler, 100);
  //     }
  //   };
  //   initScrollHandler();

  //   return () => {
  //     isComponentMounted = false;
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //     window.removeEventListener('scroll', handleScroll);
  //     window.removeEventListener('resize', handleScroll);
  //   };
  // }, []);
useEffect(() => {
  const video = videoRef.current;
  const container = videoContainerRef.current;

  if (!video || !container) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: 0.5 } // play when 50% visible
  );

  observer.observe(container);

  return () => observer.disconnect();
}, []);

  // Performance monitoring and debugging (optional - remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ScrollHero mounted with', heroImages.length, 'images');
      return () => {
        console.log('ScrollHero unmounted');
      };
    }
  }, [heroImages.length]);

  return (
    <div className="scroll-container" ref={containerRef}>
      <div className="sticky-view">
        <div className="horizontal-track" ref={trackRef}>
          {/* {heroImages.map((image) => (
            <div className="hero-panel" key={image.id}> */}
              {/* {renderImage(image)} */}
             {/* <div
  className="hero-panel"
  key={image.id}
  onClick={() => window.location.href = image.link}
  onTouchEnd={() => window.location.href = image.link}
>
  {renderImage(image)} */}

              
              {/* Centered content overlay - HIDDEN on Mobile via CSS */}
              {/* <div className="hero-content-centered">
                <div className="hero-text-content">
                  <p className="hero-description">{image.text}</p> */}
                  {/* <button className="hero-action-button" onClick={() => console.log(`Clicked: ${image.buttonText}`)}>
                    <span className="button-text">{image.buttonText}</span>
                    <span className="button-icon">{image.buttonIcon}</span>
                  </button> */}
                {/* </div> */}
                
                {/* Add accessibility improvement - visually hidden text for screen readers */}
                {/* <span className="sr-only">
                  Image {image.id}: {image.alt}
                </span>
              </div>
            </div>
            </div>
          ))} */} 
          <div
  className="hero-panel video-hero-panel"
  ref={videoContainerRef}
>
  <video
    ref={videoRef}
    className="hero-video"
    src="/videos/adinn  outdoor.webm"   
    muted
    loop
    playsInline
    preload="metadata"
  />
  </div>
        </div>
        
        {/* Bottom Half: Context Pane (Visible ONLY on Mobile) */}
        <div className="mobile-content-preview">
            <div className="preview-inner">
                <div className='about '>
        <div className='heading about-heading'>About <span className='highlight'>Us</span></div>
        <div className='about-content'>
          <div className='about-content1'>
            <div className='about-content1-heading'>Who <span className='highlight'>we</span> are </div>
            <div className='about-content-para'> Adinn Outdoor owns over 550 outdoor ad spaces across Tamil Nadu and extends even outside the state. Our media network spans diverse formats from billboards to police booths and we have successfully amplified brand visibility and achieved tangible results. We make sure your brand is visible to the right people at the ideal time. With 25 Years of Excellence , we know where to put your ads to get the most impact. If you want to reach more people and expand the visibility of your ads , we’re here to help. </div> 
     <div className='about-content-para about-content-para-last'><span className='highlight contactUs'>Contact Us</span>to take your brand to new heights at prime locations ,where visibility shines.</div>
          </div>
          <div className='about-content2 img-fluid'>
            <img src='./images/road_gif.png'></img>
          </div>
        </div>
      </div>
            </div>
        </div>
      </div>
      {/* Add error boundary-like fallback content */}
      {Object.keys(errorStates).length > 0 && (
        <div className="error-notice" role="alert" aria-live="polite">
          <p>Some images failed to load. Using fallback images where available.</p>
        </div>
      )}
    </div>
  );
};

export default ScrollHero;