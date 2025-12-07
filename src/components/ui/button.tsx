import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-heading font-medium uppercase transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        architect: 'bg-navy-900 text-white hover:bg-gold-500',
        outline: 'border border-line bg-transparent hover:bg-white hover:text-gold-500',
        ghost: 'hover:bg-navy-900/5',
        link: 'underline-offset-4 hover:underline text-navy-900',
        destructive: 'bg-error text-white hover:bg-error-dark',
      },
      size: {
        sm: 'h-9 px-4 text-xs tracking-widest',
        default: 'h-12 px-8 text-xs tracking-widest',
        lg: 'h-14 px-10 text-sm tracking-widest',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'architect',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
