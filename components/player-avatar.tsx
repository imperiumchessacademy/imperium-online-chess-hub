import { cn } from '@/lib/utils';

interface PlayerAvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PlayerAvatar({ username, size = 'md', className }: PlayerAvatarProps) {
  const initial = username?.charAt(0).toUpperCase() || '?';
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-2xl',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[#c68a2e] font-semibold text-black shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
