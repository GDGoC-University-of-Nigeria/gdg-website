'use client';

import { useState } from 'react';
import { HackathonHeader } from './components/HackathonHeader';
import { HackathonContent } from './components/HackathonContent';
import { RegistrationModal } from './components/RegistrationModal';
import { AppHeader, AppFooter } from '@/components/shared';

export default function HackathonPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <AppHeader />
      <HackathonHeader onRegisterClick={() => setIsModalOpen(true)} />
      <HackathonContent />
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <AppFooter />
    </main>
  );
}
