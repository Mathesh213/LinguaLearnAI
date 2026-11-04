'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-coral text-white hover:bg-coral/90 shadow-sm border border-coral',
  secondary:
    'bg-transparent text-editorial-blue border border-editorial-blue hover:bg-editorial-blue hover:text-white',
  ghost:
    'bg-transparent text-ink border border-transparent hover:bg-black/5',
  danger:
    'bg-red-500 text-white hover:bg-red-600 border border-red-500 shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-7 text-base rounded-xl gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    href,
    className,
    type = 'button',
  },
  ref,
) {
  const isDisabled = disabled || loading;

  const baseClasses = cn(
    'inline-flex items-center justify-center font-semibold transition-colors duration-200 select-none cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editorial-blue focus-visible:ring-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );

  const content = (
    <>
      {loading && <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
    </>
  );

  if (href && !isDisabled) {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="inline-flex"
      >
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      whileHover={isDisabled ? {} : { scale: 1.01 }}
      className={baseClasses}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
