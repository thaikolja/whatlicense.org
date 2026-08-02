type Slug = string & { readonly __brand: 'Slug' }

export const useSlug = (str: string): Slug => {
  return str
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') as Slug
}