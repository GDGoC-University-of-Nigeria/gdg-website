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

// Gallery items with their corresponding background colors
const galleryItems = [
  { image: gallery1, color: 'bg-[#4285F4]' },   // Blue - coffee cup
  { image: gallery2, color: 'bg-[#FF6D8A]' },   // Pink - sparkle/grid
  { image: gallery3, color: 'bg-[#4285F4]' },   // Blue - star
  { image: gallery4, color: 'bg-[#F9AB00]' },   // Orange - complements red icon
  { image: gallery5, color: 'bg-[#F9AB00]' },   // Yellow/Orange - ring
  { image: gallery6, color: 'bg-[#34A853]' },   // Green - arrow/play
  { image: gallery7, color: 'bg-[#34A853]' },   // Green - chat
];

const GRID_COLS = 10;
const GRID_ROWS = 4;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;
const ACTIVE_CELLS = 7;
const MAX_SAME_IMAGE = 2; // No more than 2 of the same image at once

interface ActiveCell {
  index: number;
  imageIndex: number;
  phase: 'visible' | 'scaling-out' | 'scaling-in';
}

// Distribute cells evenly across the grid
const getEvenlyDistributedIndices = (count: number, total: number): number[] => {
  const indices: number[] = [];
  const cellsPerRegion = Math.floor(total / count);

  for (let i = 0; i < count; i++) {
    const regionStart = i * cellsPerRegion;
    const regionEnd = Math.min(regionStart + cellsPerRegion, total);
    const index = regionStart + Math.floor(Math.random() * (regionEnd - regionStart));
    indices.push(index);
  }

  return indices;
};

// Count occurrences of each image index
const countImageOccurrences = (cells: ActiveCell[], imageIndex: number): number => {
  return cells.filter((c) => c.imageIndex === imageIndex).length;
};

// Get a valid image index that won't exceed MAX_SAME_IMAGE
const getValidImageIndex = (cells: ActiveCell[], excludeCellIndex: number): number => {
  const availableImages: number[] = [];

  for (let i = 0; i < galleryItems.length; i++) {
    const currentCount = cells.filter(
      (c, idx) => c.imageIndex === i && idx !== excludeCellIndex
    ).length;
    if (currentCount < MAX_SAME_IMAGE) {
      availableImages.push(i);
    }
  }

  if (availableImages.length === 0) {
    return Math.floor(Math.random() * galleryItems.length);
  }

  return availableImages[Math.floor(Math.random() * availableImages.length)];
};

export const GallerySection = () => {
  const [activeCells, setActiveCells] = useState<ActiveCell[]>([]);

  const getRandomIndex = useCallback((exclude: number[]) => {
    let index;
    let attempts = 0;
    do {
      index = Math.floor(Math.random() * TOTAL_CELLS);
      attempts++;
    } while (exclude.includes(index) && attempts < 100);
    return index;
  }, []);

  // Initialize active cells with even distribution and unique images
  useEffect(() => {
    const indices = getEvenlyDistributedIndices(ACTIVE_CELLS, TOTAL_CELLS);
    const initial: ActiveCell[] = [];

    for (let i = 0; i < indices.length; i++) {
      const imageIndex = getValidImageIndex(initial, -1);
      initial.push({
        index: indices[i],
        imageIndex,
        phase: 'visible' as const,
      });
    }

    setActiveCells(initial);
  }, []);

  // Animate cells periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const cellToChange = Math.floor(Math.random() * ACTIVE_CELLS);

      // Phase 1: Scale out
      setActiveCells((prev) => {
        const newCells = [...prev];
        if (newCells[cellToChange]) {
          newCells[cellToChange] = { ...newCells[cellToChange], phase: 'scaling-out' };
        }
        return newCells;
      });

      // Phase 2: Move to new position and start scaling in
      setTimeout(() => {
        setActiveCells((prev) => {
          const newCells = [...prev];
          const usedIndices = newCells.filter((_, i) => i !== cellToChange).map((c) => c.index);
          const newIndex = getRandomIndex(usedIndices);
          const newImageIndex = getValidImageIndex(newCells, cellToChange);

          newCells[cellToChange] = {
            index: newIndex,
            imageIndex: newImageIndex,
            phase: 'scaling-in',
          };
          return newCells;
        });
      }, 400);

      // Phase 3: Fully visible
      setTimeout(() => {
        setActiveCells((prev) => {
          const newCells = [...prev];
          if (newCells[cellToChange]) {
            newCells[cellToChange] = { ...newCells[cellToChange], phase: 'visible' };
          }
          return newCells;
        });
      }, 800);
    }, 2500);

    return () => clearInterval(interval);
  }, [getRandomIndex]);

  const getCellContent = (index: number) => {
    const activeCell = activeCells.find((cell) => cell.index === index);
    if (!activeCell) return null;

    const item = galleryItems[activeCell.imageIndex];
    const scaleClass = activeCell.phase === 'scaling-out' ? 'scale-0' : 'scale-100';

    return (
      <div
        className={`absolute inset-0 overflow-hidden rounded-md ${item.color} transition-transform duration-400 ease-out ${scaleClass}`}
        style={{ transitionDuration: '400ms' }}
      >
        <Image
          src={item.image}
          alt={`Gallery item ${activeCell.imageIndex + 1}`}
          fill
          className="object-contain p-2"
        />
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
              className="relative aspect-square rounded-md bg-[#E0E0E0]"
            >
              {getCellContent(index)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
