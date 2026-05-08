import { cls } from '@/utils';

const map: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
  ongoing: 'bg-alexandra/15 text-alexandra',
  completed: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  default: 'bg-tech-white text-solid-matte-gray border border-[var(--color-border)]'
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const clsName = map[key] ?? map.default;
  return (
    <span
      className={cls('inline-block rounded-sm px-2 py-0.5 text-xs font-medium uppercase', clsName)}
    >
      {status}
    </span>
  );
}
