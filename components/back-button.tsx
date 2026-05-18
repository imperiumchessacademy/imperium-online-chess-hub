import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href = '/', label = 'Home' }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
