import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

/**
 * Brand-tuned shadcn Button variants.
 * default / outline match charcoal CTAs and muted Back control.
 */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent text-sm font-bold uppercase tracking-wide transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default:
          'btn bg-charcoal text-white hover:bg-espresso border-transparent',
        outline:
          'border-border bg-transparent text-muted hover:bg-white hover:text-charcoal',
        secondary:
          'bg-cream-dark text-charcoal border-border hover:bg-white',
        ghost:
          'text-muted hover:bg-cream-dark hover:text-charcoal',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90',
        link:
          'text-charcoal underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-auto px-8 py-3',
        sm:      'h-auto px-6 py-2 text-xs',
        lg:      'h-auto px-10 py-4',
        icon:    'size-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
