'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    // The access_token is now in an HttpOnly cookie — no need to read it from the URL.
    // The browser sends it automatically on every request via credentials: 'include'.
    const profile_complete = searchParams.get('profile_complete') === 'true';

    api.getMe()
      .then((user) => {
        setUser(user);
        if (profile_complete) {
          router.replace('/dashboard');
        } else {
          router.replace('/dashboard?prompt=complete_profile');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user after OAuth callback', err);
        router.replace('/auth?error=auth_failed');
      });
  }, [router, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-alexandra">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-alexandra border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Finalizing your sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
