const NETWORK_ERROR_MESSAGE =
  'Could not reach the server. Check your connection and try again.';

export async function analyzeResume(file, targetRole, userId) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('targetRole', targetRole);
  formData.append('userId', userId);

  let response;
  let data;

  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });
    data = await response.json();
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed. Please try again.');
  }

  return data;
}
