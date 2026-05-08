import { cls } from '@/utils';

export function SearchInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  className
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cls('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-solid-matte-gray">
          {label}
        </label>
      )}
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cls(
          'w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-blackout',
          'placeholder:text-solid-matte-gray/80',
          'focus:border-alexandra focus:ring-2 focus:ring-alexandra/30 focus:outline-none'
        )}
      />
    </div>
  );
}
