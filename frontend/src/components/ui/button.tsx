import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 select-none';
    
    const variants = {
      default: 'bg-ink text-white hover:bg-slate-800 shadow-subtle hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-slate-800',
      outline: 'bg-white text-ink border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-subtle hover:-translate-y-0.5',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:-translate-y-0.5',
      ghost: 'hover:bg-slate-100 hover:text-slate-900',
      link: 'text-accent-blue underline-offset-4 hover:underline'
    };

    const sizes = {
      default: 'h-10 px-5 py-2.5',
      sm: 'h-8 rounded-lg px-3 text-xs',
      lg: 'h-12 rounded-xl px-7 text-base font-semibold',
      icon: 'h-10 w-10'
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
