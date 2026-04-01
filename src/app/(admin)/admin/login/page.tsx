'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { cls } from '@/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    try {
      await api.adminLogin({ email: data.email, password: data.password });
      const me = await api.getMe();
      setUser(me);
      router.push('/admin');
    } catch (e) {
      setSubmitError(e instanceof ApiError ? e.message : 'Login failed. Admin access required.');
    }
  };

  return (
    <div className={cls('min-h-[60vh] flex items-center justify-center py-12')}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cls(
          'w-full max-w-md rounded-2xl border border-[#DADCE0] bg-white p-8 shadow-sm',
          'text-blackout'
        )}
      >
        <h1 className={cls('text-2xl font-semibold text-blackout mb-2')}>Admin login</h1>
        <p className={cls('text-sm text-solid-matte-gray mb-6')}>
          Sign in with an admin account to access the dashboard.
        </p>

        {submitError && (
          <div
            className={cls(
              'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700'
            )}
          >
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={cls('space-y-4')}>
          <div>
            <label htmlFor="email" className={cls('block text-sm font-medium text-blackout mb-1')}>
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="admin@example.com"
              className={cls(
                'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
            />
            {errors.email && (
              <p className={cls('mt-1 text-sm text-red-600')}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={cls('block text-sm font-medium text-blackout mb-1')}>
              Password
            </label>
            <div className={cls('relative')}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={cls(
                  'w-full px-4 py-2 pr-12 border border-[#DADCE0] rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                  'text-blackout'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cls(
                  'absolute right-3 top-1/2 -translate-y-1/2 text-solid-matte-gray hover:text-blackout transition-colors'
                )}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className={cls('mt-1 text-sm text-red-600')}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cls(
              'w-full py-2.5 bg-alexandra text-white font-medium rounded-lg',
              'hover:bg-[#357AE8] disabled:opacity-60 transition-colors'
            )}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className={cls('mt-6 text-center text-sm text-solid-matte-gray')}>
          <Link href="/" className={cls('text-alexandra hover:underline')}>
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
