'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

import gallery1 from '@/assets/gallery-1.png';
import gallery2 from '@/assets/gallery-2.png';
import gallery3 from '@/assets/gallery-3.png';
import gallery4 from '@/assets/gallery-4.png';
import gallery5 from '@/assets/gallery-5.png';
import gallery6 from '@/assets/gallery-6.png';
import gallery7 from '@/assets/gallery-7.png';

const galleryItems = [
  { image: gallery1, color: 'bg-[#4285F4]' },
  { image: gallery2, color: 'bg-[#FF6D8A]' },
  { image: gallery3, color: 'bg-[#4285F4]' },
  { image: gallery4, color: 'bg-[#F9AB00]' },
  { image: gallery5, color: 'bg-[#F9AB00]' },
  { image: gallery6, color: 'bg-[#34A853]' },
  { image: gallery7, color: 'bg-[#34A853]' },
];

interface ActiveCell {
  index: number;
  imageIndex: number;
  phase: 'visible' | 'scaling-out' | 'scaling-in';
}

export const GallerySection = () => {
  const [activeCells, setActiveCells] = useState<ActiveCell[]>([]);
  const [gridCols, setGridCols] = useState(10);
  const [gridRows, setGridRows] = useState(4);
  
  const TOTAL_CELLS = gridCols * gridRows;
  const ACTIVE_CELLS = 7;

  // Responsive Grid Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGridCols(5); // 5 columns for phones
        setGridRows(6); // More rows to maintain space
      } else if (window.innerWidth < 1024) {
        setGridCols(8); // 8 columns for tablets
        setGridRows(4);
      } else {
        setGridCols(10); // 10 columns for desktop
        setGridRows(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRandomIndex = useCallback((exclude: number[]) => {
    let index;
    let attempts = 0;
    do {
      index = Math.floor(Math.random() * TOTAL_CELLS);
      attempts++;
    } while (exclude.includes(index) && attempts < 100);
    return index;
  }, [TOTAL_CELLS]);

  useEffect(() => {
    const indices = Array.from({ length: ACTIVE_CELLS }, (_, i) => 
      Math.floor((i * TOTAL_CELLS) / ACTIVE_CELLS) + Math.floor(Math.random() * (TOTAL_CELLS / ACTIVE_CELLS))
    );
    
    const initial = indices.map(idx => ({
      index: idx,
      imageIndex: Math.floor(Math.random() * galleryItems.length),
      phase: 'visible' as const,
    }));

    setActiveCells(initial);
  }, [TOTAL_CELLS]);

  // Animation logic preserved from original
  useEffect(() => {
    const interval = setInterval(() => {
      const cellToChange = Math.floor(Math.random() * ACTIVE_CELLS);
      setActiveCells(prev => {
        const next = [...prev];
        if (next[cellToChange]) next[cellToChange].phase = 'scaling-out';
        return next;
      });

      setTimeout(() => {
        setActiveCells(prev => {
          const next = [...prev];
          const used = next.filter((_, i) => i !== cellToChange).map(c => c.index);
          next[cellToChange] = {
            index: getRandomIndex(used),
            imageIndex: Math.floor(Math.random() * galleryItems.length),
            phase: 'scaling-in',
          };
          return next;
        });
      }, 400);

      setTimeout(() => {
        setActiveCells(prev => {
          const next = [...prev];
          if (next[cellToChange]) next[cellToChange].phase = 'visible';
          return next;
        });
      }, 800);
    }, 2500);

    return () => clearInterval(interval);
  }, [getRandomIndex, TOTAL_CELLS]);

  const getCellContent = (index: number) => {
    const activeCell = activeCells.find((cell) => cell.index === index);
    if (!activeCell) return null;

    const item = galleryItems[activeCell.imageIndex];
    const scaleClass = activeCell.phase === 'scaling-out' ? 'scale-0' : 'scale-100';

    return (
      <div className={`absolute inset-0 overflow-hidden rounded-md ${item.color} transition-transform duration-400 ease-out ${scaleClass}`}>
        <Image src={item.image} alt="Build" fill className="object-contain p-2" />
      </div>
    );
  };

  return (
    <section className="bg-[#F5F5F5] px-6 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-10 text-center">
          <h2 className="mb-3 flex items-center justify-center gap-2 text-2xl font-normal text-blackout md:text-3xl">
            <span className="text-[#FBBC04]">→</span>
            Gallery of Real Builds
            <span className="text-[#34A853]">←</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm text-solid-matte-gray">
            See what happens when UNN talent gets hands-on: code, design, and strategy that ships.
          </p>
        </div>

        <div 
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
            <div key={index} className="relative aspect-square rounded-md bg-[#E0E0E0]">
              {getCellContent(index)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};