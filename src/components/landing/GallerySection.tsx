'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import gallery1 from '@/assets/gallery-1.png';
import gallery2 from '@/assets/gallery-2.png';
import gallery3 from '@/assets/gallery-3.png';
import gallery4 from '@/assets/gallery-4.png';
import gallery5 from '@/assets/gallery-5.png';
import gallery6 from '@/assets/gallery-6.png';
import gallery7 from '@/assets/gallery-7.png';

// Gallery items with their corresponding background colors and designated icons
const galleryItems = [
  { image: gallery1, color: 'bg-[#4285F4]', icon: gallery1 },   // Blue - coffee cup
  { image: gallery2, color: 'bg-[#FF6D8A]', icon: gallery2 },   // Pink - sparkle/grid
  { image: gallery3, color: 'bg-[#4285F4]', icon: gallery3 },   // Blue - star
  { image: gallery4, color: 'bg-[#F9AB00]', icon: gallery4 },   // Orange - complements red icon
  { image: gallery5, color: 'bg-[#F9AB00]', icon: gallery5 },   // Yellow/Orange - ring
  { image: gallery6, color: 'bg-[#34A853]', icon: gallery6 },   // Green - arrow/play
  { image: gallery7, color: 'bg-[#34A853]', icon: gallery7 },   // Green - chat
];

const GRID_COLS = 10;
const GRID_ROWS = 4;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

// Assign each cell a designated color and icon
// This creates an array where each index maps to a gallery item
const getCellDesignation = (index: number): number => {
  // Cycle through gallery items to ensure even distribution
  return index % galleryItems.length;
};

export const GallerySection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const hideTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const mobileAnimationRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Schedule hiding a box after 2 seconds
  const scheduleHide = (index: number) => {
    // Clear any existing timer for this box
    const existingTimer = hideTimersRef.current.get(index);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer to hide after 2 seconds
    const timer = setTimeout(() => {
      setVisibleIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      hideTimersRef.current.delete(index);
    }, 2000);

    hideTimersRef.current.set(index, timer);
  };

  // Handle hover - show immediately, schedule previous box to hide
  const handleMouseEnter = (index: number) => {
    const previousIndex = hoveredIndex;

    // Show the new box immediately
    setHoveredIndex(index);
    setVisibleIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    // If there was a previous box, schedule it to hide after 2 seconds
    if (previousIndex !== null && previousIndex !== index) {
      scheduleHide(previousIndex);
    }
  };

  // Handle mouse leave - schedule current box to hide after 2 seconds
  const handleMouseLeave = () => {
    const currentIndex = hoveredIndex;
    setHoveredIndex(null);

    if (currentIndex !== null) {
      scheduleHide(currentIndex);
    }
  };

  // Mobile: Auto-animate random boxes
  useEffect(() => {
    if (!isMobile) return;

    const animateRandomBox = () => {
      const randomIndex = Math.floor(Math.random() * TOTAL_CELLS);
      setVisibleIndices((prev) => {
        const next = new Set(prev);
        next.add(randomIndex);
        return next;
      });

      // Hide after 2 seconds
      setTimeout(() => {
        setVisibleIndices((prev) => {
          const next = new Set(prev);
          next.delete(randomIndex);
          return next;
        });
      }, 2000);
    };

    // Start animation immediately, then repeat every 3 seconds
    animateRandomBox();
    mobileAnimationRef.current = setInterval(animateRandomBox, 3000);

    return () => {
      if (mobileAnimationRef.current) {
        clearInterval(mobileAnimationRef.current);
      }
    };
  }, [isMobile]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      hideTimersRef.current.forEach((timer) => clearTimeout(timer));
      hideTimersRef.current.clear();
      if (mobileAnimationRef.current) {
        clearInterval(mobileAnimationRef.current);
      }
    };
  }, []);

  const getCellContent = (index: number) => {
    const imageIndex = getCellDesignation(index);
    const item = galleryItems[imageIndex];
    const isVisible = visibleIndices.has(index);

    return (
      <div
        className={`absolute inset-0 overflow-hidden transition-transform duration-300 ease-out ${
          isVisible ? 'scale-100' : 'scale-0'
        }`}
      >
        {/* Colored background - appears on hover */}
        <div className={`absolute inset-0 ${item.color}`} />
        {/* Icon - appears on hover */}
        <div className="relative h-full w-full">
          <Image
            src={item.icon}
            alt={`Gallery item ${imageIndex + 1}`}
            fill
            className="object-contain p-6"
          />
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#F5F5F5] px-4 md:px-0 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 flex items-center justify-center gap-2 text-2xl font-normal text-blackout md:text-3xl">
            <span className="text-[#FBBC04]">→</span>
            Gallery of Real Builds
            <span className="text-[#34A853]">←</span>
          </h2>
          <p className="text-sm text-solid-matte-gray">
            See what happens when UNN talent gets hands-on: code, design, and strategy that ships.
          </p>
        </div>

        {/* Grid - Full Width */}
        <div
          className="grid gap-1.5 md:gap-2"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          }}
        >
          {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-square bg-[#E0E0E0] cursor-pointer"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {getCellContent(index)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
