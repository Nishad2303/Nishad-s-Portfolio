import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const projectPhotosRoot = path.resolve(process.cwd(), 'Projects', 'photos');
const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments?.length || segments.some((part) => part === '.' || part === '..' || part.includes('/') || part.includes('\\'))) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = path.resolve(projectPhotosRoot, ...segments);
  if (!filePath.startsWith(`${projectPhotosRoot}${path.sep}`) || !allowedExtensions.has(path.extname(filePath).toLowerCase())) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return new Response('Not found', { status: 404 });
    const contents = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mime = extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : extension === '.gif' ? 'image/gif' : extension === '.webp' ? 'image/webp' : 'image/png';
    return new Response(new Uint8Array(contents), {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
