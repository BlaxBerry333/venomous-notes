import pkg from '../../package.json'

function __kebabCaseToTitleCase(s: string): string {
  return s
    .split('-')
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ')
}

export const SITE_META = {
  NAME: __kebabCaseToTitleCase(pkg.name),
  DESCRIPTION: pkg.description,
}
