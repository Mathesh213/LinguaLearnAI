import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'easy' | 'moderate' | 'difficult' | 'demo' | 'new' | 'default';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  moderate: 'bg-amber-100 text-amber-700 border border-amber-200',
  difficult: 'bg-red-100 text-red-700 border border-red-200',
  demo: 'bg-editorial-blue/10 text-editorial-blue border border-editorial-blue/20',
  new: 'bg-coral/10 text-coral border border-coral/20',
  default: 'bg-soft-neutral text-ink/70 border border-black/8',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
