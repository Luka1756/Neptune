import type { ComponentType } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import { RequireSession } from '@/features/auth/RequireSession'
import { GuildLayout } from '@/features/guilds/GuildLayout'
import { personalSection, serverSections, type SectionId } from '@/shared/config/sections'
import { LoadingState } from '@/shared/ui'
import { AppShell } from './layouts/AppShell'
import { StandaloneLayout } from './layouts/StandaloneLayout'
import { NotFound } from './NotFound'
import { RouteError } from './RouteError'

type PageModule = { Component: ComponentType }
type PageLoader = () => Promise<PageModule>

/**
 * Each page is loaded on demand and exports a `Component`. To add a section:
 * add it to `shared/config/sections.ts`, then add its loader here.
 */
const pages: Record<SectionId, PageLoader> = {
  overview: () => import('@/features/overview/OverviewPage'),
  utilities: () => import('@/features/utilities/UtilitiesPage'),
  configuration: () => import('@/features/configuration/ConfigurationPage'),
  automation: () => import('@/features/automation/AutomationPage'),
  information: () => import('@/features/information/InformationPage'),
  integrations: () => import('@/features/integrations/IntegrationsPage'),
  personalisation: () => import('@/features/personalisation/PersonalisationPage'),
}

/** Exported (instead of creating the router here) so tests can build their own in-memory router. */
export const routes: RouteObject[] = [
  {
    errorElement: <RouteError />,
    HydrateFallback: LoadingState,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      // Pages outside the app shell
      {
        element: <StandaloneLayout />,
        children: [{ path: 'login', lazy: () => import('@/features/auth/LoginPage') }],
      },

      // Pages that need a signed-in person (see RequireSession for what that does and doesn't mean)
      {
        element: <RequireSession />,
        children: [
          {
            element: <AppShell />,
            children: [
              { path: 'servers', lazy: () => import('@/features/guilds/ServersPage') },
              {
                path: 'g/:guildId',
                element: <GuildLayout />,
                children: [
                  { index: true, element: <Navigate to="overview" replace /> },
                  ...serverSections.map((section) => ({ path: section.path, lazy: pages[section.id] })),
                ],
              },
              { path: `me/${personalSection.path}`, lazy: pages[personalSection.id] },
            ],
          },
        ],
      },

      {
        element: <StandaloneLayout />,
        children: [{ path: '*', element: <NotFound /> }],
      },
    ],
  },
]
