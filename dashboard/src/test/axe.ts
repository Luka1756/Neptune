import axe from 'axe-core'

/**
 * Runs axe-core on part of the page and returns a readable list of violations.
 *
 * Colour contrast is skipped because jsdom has no layout or styles, so axe
 * can't measure it here. Contrast is checked separately against the design
 * tokens (see dashboard/README.md).
 */
export async function accessibilityViolations(root: Element): Promise<string[]> {
  const results = await axe.run(root, { rules: { 'color-contrast': { enabled: false } } })
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help} (${violation.nodes.map((node) => node.target.join(' ')).join(', ')})`,
  )
}
