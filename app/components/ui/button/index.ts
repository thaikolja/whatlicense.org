/**
 * shadcn-vue Button: CVA variants tuned to whatlicense brand (charcoal / cream).
 *
 * Do not use the CSS class name `cta` here — that is reserved for plain
 * marketing CTAs in `main.css` so cascade never collides with shadcn.
 */
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

// re-export the Vue SFC
export { default as Button } from './Button.vue'

/**
 * Brand-tuned shadcn Button variants.
 * default / outline match charcoal CTAs and muted Back control.
 */
export const buttonVariants = cva(
  // shared base — pill, focus ring, disabled, icons (no product CSS class names)
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent text-sm font-bold uppercase tracking-wide transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      // visual flavors
      variant: {
        default:
          'bg-charcoal text-white hover:bg-espresso border-transparent shadow-sm hover:-translate-y-0.5 hover:shadow-md',
        outline:
          'border-border bg-transparent text-muted hover:bg-white hover:text-charcoal',
        secondary:
          'bg-cream-dark text-charcoal border-border hover:bg-white',
        ghost:
          'text-muted hover:bg-cream-dark hover:text-charcoal',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90',
        link:
          'text-charcoal underline-offset-4 hover:underline rounded-none'
      },
      // padding / type scale
      size: {
        default: 'h-auto min-h-11 px-8 py-3',
        sm:      'h-auto min-h-10 px-6 py-2 text-xs',
        lg:      'h-auto min-h-12 px-10 py-4 text-base',
        icon:    'size-10 rounded-full'
      }
    },
    // defaults when props omitted
    defaultVariants: {
      variant: 'default',
      size:    'default'
    }
  }
)

/** Inferred props type for the CVA variants. */
export type ButtonVariants = VariantProps<typeof buttonVariants>
