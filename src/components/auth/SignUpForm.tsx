'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api, ApiError } from '@/lib/api';

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const BACKEND_FIELD_TO_FORM: Record<string, keyof SignUpFormData> = {
  full_name: 'fullName',
  email: 'email',
  password: 'password',
  confirm_password: 'confirmPassword',
  phone: 'phoneNumber',
};

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setSubmitError(null);
    try {
      await api.register({
        email: data.email,
        full_name: data.fullName,
        password: data.password,
        confirm_password: data.confirmPassword,
        phone: data.phoneNumber?.trim() || undefined,
      });
      router.push('/auth?mode=login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && e.body && typeof e.body === 'object' && 'detail' in e.body) {
        const detail = (e.body as { detail: Array<{ loc?: unknown[]; msg?: string }> }).detail;
        if (Array.isArray(detail)) {
          for (const item of detail) {
            const loc = item.loc;
            const backendField = Array.isArray(loc) && loc[1] && typeof loc[1] === 'string' ? loc[1] : null;
            const formField = backendField ? BACKEND_FIELD_TO_FORM[backendField] : null;
            const message = (item.msg ?? '').replace(/^Value error,?\s*/i, '');
            if (formField && message) {
              setError(formField, { type: 'server', message });
            }
          }
          return;
        }
      }
      setSubmitError(e instanceof ApiError ? e.message : 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex flex-col"
    >
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center space-y-2 mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-blackout">
            Create My Builder Profile
          </h1>
          <p className="text-sm sm:text-base text-solid-matte-gray max-w-md mx-auto">
            You're one step away from joining the community that ships real projects. Stop browsing,
            start building.
          </p>
        </motion.div>

        {submitError && (
          <p className="mb-4 text-sm text-red-500 text-center">{submitError}</p>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-blackout mb-2">
              Full name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder='Tony Stark'
              {...register('fullName')}
              className="w-full px-4 py-3 border border-[#DADCE0] rounded-none focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent text-blackout bg-white"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blackout mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="ironman@avengers.io"
              className="w-full px-4 py-3 border border-[#DADCE0] rounded-none focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent text-blackout bg-white placeholder:text-[#9AA0A6]"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number (optional) */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-blackout mb-2">
              Phone number (optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="+2348012345678 (optional)"
              className="w-full px-4 py-3 border border-[#DADCE0] rounded-none focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent text-blackout bg-white placeholder:text-[#9AA0A6]"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blackout mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className="w-full px-4 py-3 pr-12 border border-[#DADCE0] rounded-none focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent text-blackout bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-solid-matte-gray hover:text-blackout transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-blackout mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-3 pr-12 border border-[#DADCE0] rounded-none focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent text-blackout bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-solid-matte-gray hover:text-blackout transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              {...register('agreeToTerms')}
              className="mt-1 w-4 h-4 text-alexandra border-[#DADCE0] rounded focus:ring-alexandra"
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-xs text-blackout">
              By signing up, you agree to join the best tech community at UNN.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-alexandra text-white py-3 px-4 rounded-none font-medium hover:bg-[#357AE8] transition-colors shadow-sm"
          >
            Sign up
          </button>
        </motion.form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DADCE0]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-solid-matte-gray">Or continue by signing up with</span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignUp}
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-[#DADCE0] bg-white text-blackout py-3 px-4 rounded-none font-medium hover:border-alexandra hover:text-alexandra transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-blackout mt-auto pt-4"
        >
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              router.push('/auth?mode=login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[#F9AB00] hover:text-[#EA4335] font-medium underline-offset-2 hover:underline transition-colors"
          >
            Login
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
