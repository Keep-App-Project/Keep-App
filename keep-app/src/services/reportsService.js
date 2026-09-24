import { USE_MOCK, wait, apiFetch } from './config';
import { mockReportsSummary } from './mock/reports';

export async function getSummary() {
  if (USE_MOCK) {
    await wait(300);
    return mockReportsSummary;
  }
  return apiFetch('/reports/summary');
}

export default { getSummary };
