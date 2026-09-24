import { USE_MOCK, wait, apiFetch } from './config';
import { mockLists } from './mock/lists';

let lists = JSON.parse(JSON.stringify(mockLists));

export async function getLists() {
  if (USE_MOCK) {
    await wait(300);
    return lists;
  }
  return apiFetch('/lists');
}

export async function getListById(id) {
  if (USE_MOCK) {
    await wait(200);
    return lists.find((l) => l.id === id) || null;
  }
  return apiFetch(`/lists/${id}`);
}

export async function createList(name) {
  if (USE_MOCK) {
    await wait(300);
    const newList = { id: `l${Date.now()}`, name, items: [] };
    lists = [...lists, newList];
    return newList;
  }
  return apiFetch('/lists', { method: 'POST', body: JSON.stringify({ name }) });
}

export async function addItemToList(listId, item) {
  if (USE_MOCK) {
    await wait(200);
    lists = lists.map((l) =>
      l.id === listId
        ? { ...l, items: [...l.items, { id: `li${Date.now()}`, comprado: false, quantity: 1, ...item }] }
        : l
    );
    return lists.find((l) => l.id === listId);
  }
  return apiFetch(`/lists/${listId}/items`, { method: 'POST', body: JSON.stringify(item) });
}

export async function addItemsToList(listId, items) {
  if (USE_MOCK) {
    await wait(300);
    const newItems = items.map((item, index) => ({
      id: `li${Date.now()}_${index}`,
      comprado: false,
      quantity: 1,
      ...item,
    }));
    lists = lists.map((l) => (l.id === listId ? { ...l, items: [...l.items, ...newItems] } : l));
    return lists.find((l) => l.id === listId);
  }
  return apiFetch(`/lists/${listId}/items/batch`, { method: 'POST', body: JSON.stringify({ items }) });
}

export async function toggleItemComprado(listId, itemId) {
  if (USE_MOCK) {
    await wait(150);
    lists = lists.map((l) =>
      l.id === listId
        ? { ...l, items: l.items.map((i) => (i.id === itemId ? { ...i, comprado: !i.comprado } : i)) }
        : l
    );
    return lists.find((l) => l.id === listId);
  }
  return apiFetch(`/lists/${listId}/items/${itemId}/toggle`, { method: 'PATCH' });
}

export async function removeItem(listId, itemId) {
  if (USE_MOCK) {
    await wait(150);
    lists = lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l));
    return lists.find((l) => l.id === listId);
  }
  return apiFetch(`/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
}

export default { getLists, getListById, createList, addItemToList, addItemsToList, toggleItemComprado, removeItem };
