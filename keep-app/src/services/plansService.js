import { USE_MOCK, wait, apiFetch } from './config';
import { mockPlans } from './mock/plans';

export async function getPlans() {
  if (USE_MOCK) {
    await wait(300);
    return mockPlans;
  }
  return apiFetch('/plans');
}

export async function subscribeToPlan(planId) {
  if (USE_MOCK) {
    await wait(500);
    return { success: true, planId };
  }
  return apiFetch('/plans/subscribe', { method: 'POST', body: JSON.stringify({ planId }) });
}

export default { getPlans, subscribeToPlan };
