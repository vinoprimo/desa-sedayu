export function entrySlug(id: string) {
  return id.replace(/\.mdx?$/, '').replace(/\\/g, '/');
}
