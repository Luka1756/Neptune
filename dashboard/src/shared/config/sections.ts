import {
  Info,
  LayoutDashboard,
  Plug,
  SlidersHorizontal,
  UserRound,
  Wrench,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

/**
 * The single list of dashboard sections. Navigation, the Overview page and
 * the router all read from here, so adding or enabling a section means
 * changing it in one place.
 */

export type SectionId =
  | 'overview'
  | 'utilities'
  | 'configuration'
  | 'automation'
  | 'information'
  | 'integrations'
  | 'personalisation'

/** `available` has working content. `coming-soon` shows the Coming soon state and nothing else. */
export type SectionStatus = 'available' | 'coming-soon'

export interface Section {
  id: SectionId
  label: string
  /** Route segment, relative to `/g/:guildId` for server sections. */
  path: string
  icon: LucideIcon
  summary: string
  status: SectionStatus
}

/** Settings that apply to one server. Routes live under `/g/:guildId/`. */
export const serverSections: readonly Section[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: 'overview',
    icon: LayoutDashboard,
    summary: 'What this dashboard covers.',
    status: 'available',
  },
  {
    id: 'utilities',
    label: 'Utilities',
    path: 'utilities',
    icon: Wrench,
    summary: 'Choose which tool categories this server can use.',
    status: 'coming-soon',
  },
  {
    id: 'configuration',
    label: 'Configuration',
    path: 'configuration',
    icon: SlidersHorizontal,
    summary: 'Server-wide settings for Neptune.',
    status: 'coming-soon',
  },
  {
    id: 'automation',
    label: 'Automation',
    path: 'automation',
    icon: Workflow,
    summary: 'Planned for a later release.',
    status: 'coming-soon',
  },
  {
    id: 'information',
    label: 'Information',
    path: 'information',
    icon: Info,
    summary: 'Planned for a later release.',
    status: 'coming-soon',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    path: 'integrations',
    icon: Plug,
    summary: 'Planned for a later release.',
    status: 'coming-soon',
  },
]

/** Settings that belong to the signed-in person and apply across every server. Route: `/me/personalisation`. */
export const personalSection: Section = {
  id: 'personalisation',
  label: 'Personalisation',
  path: 'personalisation',
  icon: UserRound,
  summary: 'Your own preferences, applied across all servers.',
  status: 'coming-soon',
}

export const guildPath = (guildId: string, section: Section): string =>
  `/g/${guildId}/${section.path}`

export const personalPath = (section: Section = personalSection): string => `/me/${section.path}`
