'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    title: 'Mentorship',
    blurp: 'Office hours & guidance from builders who ship.',
    dotClass: 'bg-[#4285F4]'
  },
  {
    title: 'Showcase',
    blurp: 'Submit projects and grow your portfolio in public.',
    dotClass: 'bg-[#EA4335]'
  },
  {
    title: 'Network',
    blurp: 'Plug into UNN’s core developer community.',
    dotClass: 'bg-[#F9AB00]'
  },
  {
    title: 'Events',
    blurp: 'Workshops and meetups tailored for makers.',
    dotClass: 'bg-[#34A853]'
  }
] as const;

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  const text =
    mode === 'login' ? ' Welcome Back, Builder. ' : " Let's Build Together. ";
  const headline =
    mode === 'login'
      ? 'Pick up where you left off.'
      : 'Start your GDG chapter.';

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-zinc-900 text-zinc-100">
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:gap-14 md:px-8 md:py-16 lg:gap-20">
        {/* Copy column */}
        <motion.div
          className="flex flex-1 flex-col justify-center md:max-w-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
            <span
              className="inline-flex h-1.5 w-1.5 rounded-full bg-[#4285F4]"
              aria-hidden
            />
            GDG · UNN Campus
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-2"
            >
              <p className="text-lg leading-snug font-medium text-zinc-300 md:text-xl">
                {headline}
              </p>
              <h1 className="text-3xl leading-tight font-bold tracking-tight text-white md:text-4xl">
                <span className="text-[#4285F4]">{`\{`}</span>
                {text}
                <span className="text-[#EA4335]">{`\}`}</span>
              </h1>
              <p className="max-w-md pt-2 text-sm leading-relaxed text-zinc-400 md:text-base">
                Access exclusive mentorship, submit your projects, and become
                part of UNN&apos;s core tech network. It starts here.
              </p>
            </motion.div>
          </AnimatePresence>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map(({ title, blurp, dotClass }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.12 + i * 0.06,
                  ease: 'easeOut'
                }}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 backdrop-blur-sm"
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${dotClass}`}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                    {blurp}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span className="text-zinc-600">Prefer a different flow?</span>
            <Link
              href="/auth?mode=login"
              scroll={false}
              className={`font-medium transition-colors ${
                mode === 'login'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-[#4285F4]'
              }`}
            >
              Sign in
            </Link>
            <span className="hidden text-zinc-700 sm:inline" aria-hidden>
              ·
            </span>
            <Link
              href="/auth?mode=signup"
              scroll={false}
              className={`font-medium transition-colors ${
                mode === 'signup'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-[#4285F4]'
              }`}
            >
              Create account
            </Link>
          </div>
        </motion.div>

        {/* Auth surface */}
        <motion.div
          className="flex w-full flex-1 items-center justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="relative w-full max-w-md">
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-br from-white/25 via-white/5 to-transparent opacity-80"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-zinc-900/60 p-1 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl">
              <div className="rounded-[0.9rem] bg-white p-1 shadow-inner">
                <div className="rounded-[0.8rem] bg-linear-to-b from-white to-zinc-50/90 px-1 pt-6 pb-2 sm:px-2 sm:pt-8 sm:pb-4">
                  <p className="mb-4 text-center text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                    {mode === 'login' ? 'Member access' : 'Join the chapter'}
                  </p>
                  {children}
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-zinc-500">
              By continuing you agree to our community guidelines and code of
              conduct.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
