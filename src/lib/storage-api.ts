import { TODO } from "../components/types";

export const LIST_KEY = "todo-list";

export const saveToStorage = async (newTodos: TODO[]) =>
  new Promise<TODO[]>((resolve) => {
    sessionStorage.setItem(LIST_KEY, JSON.stringify(newTodos));
    resolve(newTodos);
  });

export const fetchAllTodos = async () =>
  new Promise<TODO[]>((resolve) => {
    const item = sessionStorage.getItem(LIST_KEY);
    resolve(item ? JSON.parse(item) : []);
  });

export const saveToCloud = async (todos: TODO[]) =>
  new Promise<void>((resolve) => {
    const json = JSON.stringify(todos);
    localStorage.setItem(LIST_KEY, json);
    resolve();
  });

export const fetchAllTodosFromCloud = async () =>
  new Promise<TODO[]>((resolve) => {
    const item = localStorage.getItem(LIST_KEY);
    resolve(item ? JSON.parse(item) : []);
  });
