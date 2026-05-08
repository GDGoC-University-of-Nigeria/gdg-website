'use client';

import { useEffect, useLayoutEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  api,
  readOAuthBearerFromWindow,
  setAccessToken,
  stripOAuthTokenFromBrowserUrl
} from '@/lib/api';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  // Layout: set Bearer before AuthProvider hydration useEffect fires getMe (avoids 401 races).
  useLayoutEffect(() => {
    const bearer = readOAuthBearerFromWindow();
    if (bearer) {
      setAccessToken(bearer);
      stripOAuthTokenFromBrowserUrl();
    }
  }, []);

  useEffect(() => {
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
