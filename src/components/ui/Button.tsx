import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cls } from '@/utils';

const variants = {
  primary:
    'bg-alexandra text-white hover:bg-[var(--color-primary-hover)] shadow-sm disabled:opacity-50',
  outline:
    'border border-[var(--color-border)] bg-white text-blackout hover:border-alexandra hover:text-alexandra',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  ghost: 'text-blackout hover:bg-tech-white'
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-lg'
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cls(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-alexandra focus-visible:ring-offset-2 focus-visible:outline-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
