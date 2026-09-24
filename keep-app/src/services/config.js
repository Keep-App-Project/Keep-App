// ÚNICO arquivo que precisa mudar quando o backend real estiver pronto.
// Troque USE_MOCK para false e ajuste API_BASE_URL.

export const USE_MOCK = true;

export const API_BASE_URL = 'https://api.keepapp.com.br/v1';

export const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Erro na API (${response.status}): ${errorBody}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export default { USE_MOCK, API_BASE_URL, wait, apiFetch };
