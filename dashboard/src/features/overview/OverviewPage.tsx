import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { useGuildId } from '@/features/guilds/useGuildId'
import { guildPath, personalPath, serverSections } from '@/shared/config/sections'
import { PageHeader, SectionHeading } from '@/shared/ui'

export function Component() {
  const guildId = useGuildId()
  const sections = serverSections.filter((section) => section.id !== 'overview')

  return (
    <>
      <PageHeader title="Overview" description="Manage how Neptune works in this server." />

      <div className="max-w-prose space-y-3 text-fg-muted">
        <p>
          This is the dashboard for the server selected in the sidebar. Settings in the sections below apply to that
          server only.
        </p>
        <p>
          Your own preferences are under{' '}
          <Link to={personalPath()} className="text-accent underline underline-offset-2 hover:text-accent-strong">
            Personalisation
          </Link>{' '}
          and apply to you across every server.
        </p>
        <p>Nothing is connected yet, so there are no statistics or activity to show.</p>
      </div>

      <div className="mt-8">
        <SectionHeading id="sections-heading">Sections</SectionHeading>
        <ul aria-labelledby="sections-heading" className="divide-y divide-line border-y border-line">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                to={guildPath(guildId, section)}
                className="flex min-h-14 items-center gap-3 px-2 py-2.5 transition-colors hover:bg-raised"
              >
                <section.icon aria-hidden="true" className="size-5 shrink-0 text-fg-faint" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-fg">{section.label}</span>
                  <span className="block text-sm text-fg-muted">{section.summary}</span>
                </span>
                {section.status === 'coming-soon' && <span className="shrink-0 text-xs text-fg-faint">Coming soon</span>}
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-fg-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
