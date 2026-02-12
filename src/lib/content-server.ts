import fs from 'fs';
import path from 'path';
import { SiteContent } from './content';

export function getSiteContent(): SiteContent {
  const filePath = path.join(process.cwd(), 'content', 'site.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}
