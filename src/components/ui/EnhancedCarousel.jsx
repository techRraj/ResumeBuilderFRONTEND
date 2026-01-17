// src/components/ui/EnhancedCarousel.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './EnhancedCarousel.module.css';

const EnhancedCarousel = ({ children, autoScroll = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  
  const carouselRef = useRef(null);
  const itemsRef = useRef([]);
  const autoScrollRef = useRef(null);

  const items = React.Children.toArray(children);
  const totalItems = items.length;

  const goToSlide = useCallback((index) => {
    if (index < 0) index = totalItems - 1;
    if (index >= totalItems) index = 0;
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    
    // Reset auto-scroll after manual navigation
    if (autoScroll) {
      clearTimeout(autoScrollRef.current);
      autoScrollRef.current = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 3000);
    }
  }, [totalItems, autoScroll]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || !autoScroll) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoScrolling, autoScroll, interval, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoScrolling(!isAutoScrolling);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, isAutoScrolling]);

  // Touch and mouse drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
    setDragDistance(0);
    setIsAutoScrolling(false);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const distance = currentX - dragStartX;
    setDragDistance(distance);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // If drag distance is significant, navigate
    if (Math.abs(dragDistance) > 100) {
      if (dragDistance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setDragDistance(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoScrollRef.current) {
        clearTimeout(autoScrollRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.carouselContainer}>
      {/* Controls */}
      <div className={styles.controls}>
        <button 
          className={`${styles.controlButton} ${styles.prevButton}`}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        
        <div className={styles.indicators}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          className={`${styles.controlButton} ${styles.nextButton}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Carousel Track */}
      <div 
        ref={carouselRef}
        className={styles.carouselTrack}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className={styles.carouselSlides}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragDistance}px))`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              ref={el => itemsRef.current[index] = el}
              className={`${styles.slide} ${
                index === currentIndex ? styles.active : 
                index === currentIndex - 1 ? styles.prev :
                index === currentIndex + 1 ? styles.next : ''
              }`}
              aria-hidden={index !== currentIndex}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Auto-scroll toggle */}
      {autoScroll && (
        <div className={styles.autoScrollToggle}>
          <button
            className={styles.toggleButton}
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            aria-label={isAutoScrolling ? 'Pause auto-scroll' : 'Resume auto-scroll'}
          >
            {isAutoScrolling ? '⏸️' : '▶️'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedCarousel;