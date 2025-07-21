import { generateSalt } from './generate-salt';
import { slugify } from './slugify';

export function CreateSlug(text: string) {
  const slug = slugify(text);
  return `${slug}-${generateSalt()}`;
}
