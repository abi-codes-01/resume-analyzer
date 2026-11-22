const STORAGE_KEY = 'resume_analyzer_user_id';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getUserId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing && UUID_PATTERN.test(existing)) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, created);
  return created;
}
