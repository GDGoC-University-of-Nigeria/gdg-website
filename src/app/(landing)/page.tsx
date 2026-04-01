'use client';

import { useEffect, useState } from 'react';

import { ClockLoader } from 'react-spinners';

import {
  HeroSection,
  TeamSection,
  CommunitySection,
  CTASection,
  EventsSection,
  GallerySection,
  BlogSection,
  SponsorsSection,
} from '@/components/landing';

import { AppFooter, AppHeader } from '@/components/shared';
import { PublicForms } from '@/components/landing/PublicForms';

import { useZoomFactor } from '@/hooks';

import { cls } from '@/utils';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [formModal, setFormModal] = useState<{ kind: 'apply_to_speak' | 'volunteer' | 'contact' | null }>({
    kind: null,
  });

  const zoomFactor = useZoomFactor();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return (
    <main
      id="landing-page"
      style={{ zoom: zoomFactor }}
      className={cls(
        'relative mx-auto w-full max-w-94 overflow-clip md:max-w-360',
        isLoading && 'opacity-0'
      )}
    >
      <AppHeader />
      <HeroSection />
      <TeamSection />
      <CommunitySection />
      <CTASection />
      <EventsSection />
      <GallerySection />
      <BlogSection />
      <SponsorsSection />
      <AppFooter
        onAction={(kind) => {
          setFormModal({ kind });
        }}
      />
      <PublicForms openState={formModal} onClose={() => setFormModal({ kind: null })} />
      <section
        className={cls(
          'absolute inset-0 flex h-screen w-full items-center justify-center',
          'transition-opacity duration-500 ease-in-out',
          !isLoading && '-z-10 opacity-0'
        )}
      >
        <ClockLoader color="#4285F4" size={64} />
      </section>
    </main>
  );
}
