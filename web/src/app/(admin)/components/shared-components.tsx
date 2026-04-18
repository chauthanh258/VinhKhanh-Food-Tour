'use client';

import React from 'react';

// Simple utility function without twMerge
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Card Component
export const Card = ({ 
  children, 
  className, 
  ...props 
}: { 
  children: React.ReactNode
  className?: string 
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-secondary rounded-xl border border-border p-6 shadow-sm", className)} {...props}>
    {children}
  </div>
);

// Button Component
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
  }
>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-surface text-foreground hover:bg-surface/80 border border-border",
    outline: "border-2 border-primary/50 bg-transparent hover:bg-primary/10 text-primary-foreground",
    ghost: "bg-transparent hover:bg-white/10 text-foreground",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8",
    icon: "h-10 w-10 p-2"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Input Component
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-all duration-200 caret-primary cursor-text disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

// Textarea Component
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-all duration-200 caret-primary cursor-text disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// Select Component
export const Select = ({ 
  options, 
  value, 
  onChange, 
  className 
}: { 
  options: { label: string; value: any }[]
  value: any
  onChange: (val: any) => void
  className?: string
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-all duration-200 cursor-pointer",
      className
    )}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-primary/10 text-primary border border-primary/20",
    warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20"
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

// Dialog Component
export const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-secondary border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="text-xl">✕</span>
          </Button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading Spinner
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizes[size])} />
  );
};

// Empty State
export const EmptyState = ({ 
  title, 
  description, 
  icon,
  action
}: { 
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) => (
  <div className="flex flex-col items-center justify-center py-12">
    {icon && <div className="text-4xl mb-4 opacity-50">{icon}</div>}
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-muted-foreground mt-2">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Pagination Component
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  
  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    const start = Math.max(0, Math.min(currentPage - Math.ceil(maxVisiblePages / 2), totalPages - maxVisiblePages));
    visiblePages = pages.slice(start, start + maxVisiblePages);
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4 py-4", className)}>
      <p className="text-sm text-muted-foreground">
        Trang <span className="font-medium text-foreground">{currentPage}</span> / <span className="font-medium text-foreground">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </Button>
        
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {visiblePages[0] > 2 && <span className="px-2 text-muted-foreground">...</span>}
          </>
        )}

        {visiblePages.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="px-2 text-muted-foreground">...</span>}
            <Button
              variant={currentPage === totalPages ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

