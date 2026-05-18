import { cn } from '@/lib/utils';

interface FormIndicatorProps {
  form: string[];
  className?: string;
}

function getFormColor(result: string): string {
  switch (result) {
    case 'W': return 'bg-green-600';
    case 'L': return 'bg-red-600';
    case 'D': return 'bg-yellow-600';
    default: return 'bg-secondary';
  }
}

export function FormIndicator({ form, className }: FormIndicatorProps) {
  if (!form || form.length === 0) {
    return null;
  }
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {form.map((result, index) => (
        <div
          key={index}
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white',
            getFormColor(result)
          )}
        >
          {result}
        </div>
      ))}
    </div>
  );
}
