"use client";

import { useEffect, useState } from "react";
import { Form } from "../components/form/form";
import { List } from "../components/list/list";
import { TODO } from "../components/types";
import {
  fetchAllTodos,
  fetchAllTodosFromCloud,
  saveToCloud,
  saveToStorage,
} from "../lib/storage-api";

// asdf

export default function Home() {
  const key = process.env.NEXT_PUBLIC_API_KEY;
  if (!key) {
    throw new Error("API Key is not provided.");
  }

  const [todos, setTodos] = useState<TODO[]>([]);

  const handleSaveToStorage = async (todo: TODO) => {
    await saveToStorage([...todos, todo]);
  };

  const handleSaveToCloud = async () => {
    await saveToCloud(todos);
    alert("저장되었습니다.");
  };

  const handleFetchFromCloud = async () => {
    const items = await fetchAllTodosFromCloud();
    await saveToStorage(items);
    setTodos(items);
    alert("불러왔습니다.");
  };

  const handleDeleteFromAllStorages = async () => {
    await saveToStorage([]);
    await saveToCloud([]);
    setTodos([]);
    alert("삭제되었습니다.");
  };

  useEffect(() => {
    fetchAllTodos().then((items) => {
      setTodos(items);
    });
  }, []);

  return (
    <main className="p-4 rounded-md bg-white shadow-md w-full max-w-md flex flex-col">
      <h1 className="font-bold text-sm ">{"To Do List"}</h1>
      <List todos={todos} setTodos={setTodos} />
      <Form setTodos={setTodos} handleSaveToStorage={handleSaveToStorage} />
      <button
        className="mt-2 px-4 py-2 text-white rounded-md bg-blue-400"
        type="submit"
        onClick={handleSaveToCloud}
      >
        {"클라우드에 저장"}
      </button>
      <button
        className="mt-2 px-4 py-2 text-white rounded-md bg-blue-400"
        type="submit"
        onClick={handleFetchFromCloud}
      >
        {"클라우드에서 불러오기"}
      </button>
      <button
        className="mt-2 px-4 py-2 text-white rounded-md bg-red-400"
        type="submit"
        onClick={handleDeleteFromAllStorages}
      >
        {"모든 저장소에서 삭제"}
      </button>
    </main>
  );
}
