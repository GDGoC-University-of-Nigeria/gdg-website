import { cls } from '@/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cls('animate-pulse rounded-md bg-[var(--color-border)]/60', className)}
      aria-hidden
    />
  );
}
