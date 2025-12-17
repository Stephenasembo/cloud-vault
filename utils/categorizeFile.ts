export function categorizeFile(mime: string | undefined): 'image' | 'video' | 'document' | 'other' {
  if (!mime) return 'other';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (
    mime === 'application/pdf' ||
    mime.startsWith('text/') ||
    mime.includes('word') ||
    mime.includes('excel')
  ) return 'document';
  return 'other';
}
