'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { SignUpForm, LoginForm } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';

  return (
    <AnimatePresence mode="wait">
      {mode === 'login' ? (
        <LoginForm key="login" />
      ) : (
        <SignUpForm key="signup" />
      )}
    </AnimatePresence>
  );
}

function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace('/dashboard');
    }
  }, [isHydrated, user, router]);

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
        Redirecting to dashboard...
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