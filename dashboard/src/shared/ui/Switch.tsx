import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * An on/off control built on Radix, which handles keyboard and screen reader
 * behaviour. Always give it an accessible name: use it inside `SettingsRow`,
 * or pass `aria-label`.
 */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        // The ::before enlarges the tap target to 44px without enlarging the track.
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-control bg-canvas transition-colors before:absolute before:-inset-2.5 before:content-[""] data-[state=checked]:border-accent data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-1 rounded-full bg-fg-muted transition-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-accent-fg" />
    </SwitchPrimitive.Root>
  )
}
