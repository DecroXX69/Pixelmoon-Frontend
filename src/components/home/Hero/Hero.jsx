import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Mock banner data - In a real app, this would come from an API
  const banners = [
    {
      id: 1,
      type: 'games',
      images: [
        { id: 1, game: 'Mobile Legends', src: 'https://digitaltopup.in/banners/1745071699852--photo-output.jpeg', alt: 'Mobile Legends Banner' },
        { id: 2, game: 'Free Fire', src: 'https://digitaltopup.in/banners/1742994015836--Blog_MLBB_1.jpg', alt: 'Free Fire Banner' },
        { id: 3, game: 'PUBG', src: 'https://digitaltopup.in/banners/1743958959165--480745898_1031690782316145_507804884079710067_n.jpg', alt: 'PUBG Banner' },
        { id: 4, game: 'Valorant', src: 'https://digitaltopup.in/banners/1742994015836--Blog_MLBB_1.jpg', alt: 'Valorant Banner' },
      ]
    },
    {
      id: 2,
      type: 'giftcards',
      images: [
        { id: 1, card: 'Google Play', src: 'https://digitaltopup.in/banners/1742994369805--Google-Play-Gift-Card.jpg', alt: 'Google Play Gift Card' },
        { id: 2, card: 'Steam', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzi5Fr1fF_nnD65e9uArP86JIxywERPd57FA&s', alt: 'Steam Gift Card' },
      ]
    }
  ];

  // Display two banners per slide
  const totalSlides = Math.ceil(banners.reduce((acc, banner) => acc + banner.images.length, 0) / 2);
  
  // Auto slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide >= totalSlides - 1 ? 0 : prevSlide + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide >= totalSlides - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === 0 ? totalSlides - 1 : prevSlide - 1));
  };

  // Flatten all images for carousel
  const allImages = banners.flatMap(banner => banner.images);
  
  // Get current two images to display
  const visibleImages = [
    allImages[currentSlide * 2],
    allImages[currentSlide * 2 + 1],
  ].filter(Boolean); // Filter out undefined items if we're at the end

  return (
    <div className={styles.heroContainer}>
      <div className={styles.carousel}>
        <div className={styles.carouselInner}>
          <div className={styles.carouselSlide}>
            <div className={styles.slideContent}>
              {visibleImages.map((image, idx) => (
                <div key={`image-${idx}`} className={styles.gameCard}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={styles.gameImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button 
        className={`${styles.carouselControl} ${styles.prevControl}`} 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ◀
      </button>
      
      <button 
        className={`${styles.carouselControl} ${styles.nextControl}`} 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ▶
      </button>

      <div className={styles.carouselIndicators}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={`indicator-${index}`}
            className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;