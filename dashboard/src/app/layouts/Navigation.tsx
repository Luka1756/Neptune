import { Server } from 'lucide-react'
import { Link, NavLink, useMatch } from 'react-router'
import { guildPath, personalPath, personalSection, serverSections, type Section } from '@/shared/config/sections'
import { cn } from '@/shared/lib/cn'
import { Wordmark } from './Wordmark'

const itemClasses =
  'relative flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors lg:min-h-9'

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return cn(
    itemClasses,
    isActive
      ? 'bg-accent/10 font-medium text-accent before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent'
      : 'text-fg-muted hover:bg-raised hover:text-fg',
  )
}

interface NavGroupProps {
  id: string
  label: string
  hint?: string
  sections: readonly Section[]
  toPath: (section: Section) => string
  onNavigate?: () => void
}

function NavGroup({ id, label, hint, sections, toPath, onNavigate }: NavGroupProps) {
  return (
    <div>
      <p id={id} className="px-3 text-xs font-medium text-fg-muted">
        {label}
      </p>
      {hint && <p className="px-3 text-xs text-fg-faint">{hint}</p>}
      <ul aria-labelledby={id} className="mt-1.5 space-y-0.5">
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink to={toPath(section)} className={navLinkClassName} onClick={onNavigate}>
              <section.icon aria-hidden="true" className="size-[18px] shrink-0" />
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The sidebar contents. Shared by the desktop sidebar and the mobile drawer. */
export function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const guildId = useMatch('/g/:guildId/*')?.params.guildId

  return (
    <nav aria-label="Main" className="flex flex-col gap-6 p-4">
      <Link to="/servers" onClick={onNavigate} className="rounded-md px-3 py-1" aria-label="Neptune, go to servers">
        <Wordmark />
      </Link>

      {guildId ? (
        <>
          <div className="rounded-md border border-line bg-canvas p-3">
            <p className="text-xs text-fg-muted">Selected server</p>
            <p className="mt-0.5 truncate text-sm font-medium text-fg" title={guildId}>
              ID {guildId}
            </p>
            <Link
              to="/servers"
              onClick={onNavigate}
              className="mt-1 inline-flex min-h-11 items-center text-sm text-accent hover:text-accent-strong lg:min-h-8"
            >
              Switch server
            </Link>
          </div>
          <NavGroup
            id="nav-server"
            label="This server"
            sections={serverSections}
            toPath={(section) => guildPath(guildId, section)}
            onNavigate={onNavigate}
          />
        </>
      ) : (
        <NavLink to="/servers" className={navLinkClassName} onClick={onNavigate}>
          <Server aria-hidden="true" className="size-[18px] shrink-0" />
          Servers
        </NavLink>
      )}

      <NavGroup
        id="nav-account"
        label="Your account"
        hint="Applies to every server"
        sections={[personalSection]}
        toPath={() => personalPath()}
        onNavigate={onNavigate}
      />
    </nav>
  )
}
