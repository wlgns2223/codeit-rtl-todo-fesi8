import { LIST_KEY } from "../app/page";
import { TODO } from "../components/types";

export const saveToStorage = (newTodos: TODO[]) =>
  Promise.resolve(() => {
    sessionStorage.setItem(LIST_KEY, JSON.stringify(newTodos));
  });

export const fetchAllTodos = async () => {
  const items = await Promise.resolve(sessionStorage.getItem(LIST_KEY));

  return items ? JSON.parse(items) : [];
};
