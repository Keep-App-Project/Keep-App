import { USE_MOCK, wait, apiFetch } from './config';
import { mockRecipes } from './mock/recipes';

export async function getRecipes() {
  if (USE_MOCK) {
    await wait(300);
    return mockRecipes;
  }
  return apiFetch('/recipes');
}

export async function getRecipeById(id) {
  if (USE_MOCK) {
    await wait(200);
    return mockRecipes.find((r) => r.id === id) || null;
  }
  return apiFetch(`/recipes/${id}`);
}

export default { getRecipes, getRecipeById };
