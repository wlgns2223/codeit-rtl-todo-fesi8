import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { TODO } from "../types";
import { Dispatch, SetStateAction } from "react";
import { saveToStorage } from "../../lib/storage-api";

interface ListProps {
  todos: TODO[];
  setTodos: Dispatch<SetStateAction<TODO[]>>;
}

export const List: React.FC<ListProps> = ({ todos, setTodos }) => {
  const handleDelete = async (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    await saveToStorage(newTodos);
  };

  const handleUpdate = async (id: number) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          done: !todo.done,
        };
      }
      return todo;
    });
    setTodos(newTodos);
    await saveToStorage(newTodos);
  };

  return (
    <ul className="mt-2 min-h-48 max-h-96 divide-y overflow-y-scroll py-2  ">
      {todos.map((todo) => (
        <li key={todo.id} data-todo={todo.todo}>
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-1 text-ellipsis items-center space-x-2">
              <Icons todo={todo} />
              <p className="text-sm">{todo.todo}</p>
            </div>
            <div className="space-x-2">
              <button
                aria-label="update"
                onClick={() => handleUpdate(todo.id)}
                className="text-sm text-blue-400"
              >
                {todo.done ? "취소" : "완료"}
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-sm text-red-400"
              >
                {"삭제"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const Icons: React.FC<{ todo: TODO }> = ({ todo }) => {
  return todo.done ? (
    <CheckCircleIcon
      role="img"
      aria-label="done"
      id={"done"}
      className="w-4 h-4 text-neutral-400"
    />
  ) : (
    <XCircleIcon
      role="img"
      aria-label="not-yet"
      id={"not-yet"}
      className="w-4 h-4 text-neutral-400"
    />
  );
};
