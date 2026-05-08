'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AnimatePresence } from 'framer-motion';
import { GoogleSignup } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';

function AuthContent() {
  return (
    <AnimatePresence mode="wait">
      <GoogleSignup key="google-auth" />
    </AnimatePresence>
  );
}


function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');

  useEffect(() => {
    if (isHydrated && user) {
      if (nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')) {
        router.replace(nextPath);
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isHydrated, user, router, nextPath]);

  if (!isHydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[50vh]">
        Loading...
      </div>
    );
  }
  if (user) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[50vh]">
        Redirecting...
      </div>
    );
  }
  return <>{children}</>;
}

export default function Auth() {
  return (
    <AuthRedirectGuard>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center min-h-[50vh]">Loading...</div>}>
        <AuthContent />
      </Suspense>
    </AuthRedirectGuard>
  );
}