import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useMatch } from 'react-router'
import { NavContent } from './Navigation'
import { Wordmark } from './Wordmark'

/** The top bar and slide-in navigation drawer used below the `lg` breakpoint. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const guildId = useMatch('/g/:guildId/*')?.params.guildId

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-line bg-panel px-2 lg:hidden">
        <Dialog.Trigger
          aria-label="Open navigation"
          className="inline-flex size-11 items-center justify-center rounded-md text-fg-muted hover:bg-raised hover:text-fg"
        >
          <Menu aria-hidden="true" className="size-5" />
        </Dialog.Trigger>
        <Wordmark />
        {guildId && (
          <span className="ml-auto min-w-0 truncate pr-2 text-xs text-fg-muted" title={guildId}>
            Server {guildId}
          </span>
        )}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 animate-fade-in bg-black/60 lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] animate-drawer-in overflow-y-auto border-r border-line bg-panel lg:hidden"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Dialog.Close
            aria-label="Close navigation"
            className="absolute top-1.5 right-2 inline-flex size-11 items-center justify-center rounded-md text-fg-muted hover:bg-raised hover:text-fg"
          >
            <X aria-hidden="true" className="size-5" />
          </Dialog.Close>
          <NavContent onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
