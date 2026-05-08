import { cls } from '@/utils';

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cls('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between')}>
      <div>
        <h1 className="text-2xl font-medium text-blackout md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-solid-matte-gray md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
