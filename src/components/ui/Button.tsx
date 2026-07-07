import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-indigo-500 text-white active:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500',
  secondary: 'bg-slate-800 text-slate-100 active:bg-slate-700',
  ghost: 'bg-transparent text-slate-300 active:bg-slate-800',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-14 w-full rounded-2xl px-6 text-base font-semibold transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  )
}
