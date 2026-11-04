import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type CardVariant = 'default' | 'highlighted' | 'glass';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-ivory border border-black/8 shadow-sm',
  highlighted:
    'bg-ivory border-2 border-editorial-blue shadow-md',
  glass:
    'bg-white/60 backdrop-blur-md border border-white/40 shadow-lg',
};

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = 'default', hover = true, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl p-6 transition-all duration-200',
        variantClasses[variant],
        hover && 'hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
