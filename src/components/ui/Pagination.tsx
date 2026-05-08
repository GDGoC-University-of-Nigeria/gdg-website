import { Button } from './Button';

export function Pagination({
  page,
  hasNext,
  hasPrev,
  onPrev,
  onNext,
  loading
}: {
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" disabled={!hasPrev || loading} onClick={onPrev} type="button">
        Previous
      </Button>
      <span className="text-sm text-solid-matte-gray">Page {page}</span>
      <Button variant="outline" size="sm" disabled={!hasNext || loading} onClick={onNext} type="button">
        Next
      </Button>
    </div>
  );
}
