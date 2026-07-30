/**
 * A real uploaded imageUrl always wins; falling back to the picsum.photos
 * placeholder derived from imageSeed for projects that never had a real
 * cover image uploaded (all seeded demo data, and any project created
 * before an image was attached).
 */
export function projectImageSrc(project: { imageUrl?: string | null; imageSeed: string }): string {
  return project.imageUrl ?? `https://picsum.photos/seed/${project.imageSeed}/1000/750.webp`;
}
