import { cls } from '@/utils';

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cls(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)]',
        'bg-tech-white/50 px-6 py-14 text-center'
      )}
    >
      <p className="text-base font-medium text-blackout">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-solid-matte-gray">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
