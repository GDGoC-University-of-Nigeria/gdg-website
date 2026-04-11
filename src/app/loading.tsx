'use client';

import { ClockLoader } from 'react-spinners';

export default function Loading() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-white">
      <ClockLoader color="#4285F4" size={64} />
    </main>
  );
}
