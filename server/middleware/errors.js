export function errorHandler(err, _req, res, _next) {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Keep the PDF under 4 MB.' });
  }

  console.error('[Server] unhandled error:', err);
  return res.status(500).json({ error: 'Something went wrong on our side.' });
}
