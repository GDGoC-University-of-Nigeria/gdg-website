import Image from 'next/image';

import { cls } from '@/utils';

export function Avatar({
  src,
  alt,
  size = 40,
  className
}: {
  src: string | null | undefined;
  alt: string;
  size?: number;
  className?: string;
}) {
  const url =
    src ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(alt)}`;
  return (
    <div
      className={cls('relative shrink-0 overflow-hidden rounded-full bg-tech-white', className)}
      style={{ width: size, height: size }}
    >
      <Image src={url} alt={alt} width={size} height={size} className="object-cover" unoptimized />
    </div>
  );
}
