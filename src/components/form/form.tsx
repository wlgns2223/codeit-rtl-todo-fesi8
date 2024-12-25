import { Dispatch, SetStateAction, useState } from "react";
import { TODO } from "../types";

interface FormProps {
  setTodos: Dispatch<SetStateAction<TODO[]>>;
  handleSaveToStorage: (newTodo: TODO) => Promise<void>;
}

export const Form: React.FC<FormProps> = ({
  setTodos,
  handleSaveToStorage,
}) => {
  const [todo, setTodo] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTodo(e.target.value);
  };

  const handleAddTodo = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!todo) {
      return;
    }

    const newTodo: TODO = {
      id: new Date().getTime(),
      todo,
      done: false,
    };

    setTodos((prev) => {
      return [...prev, newTodo];
    });

    await handleSaveToStorage(newTodo);

    setTodo("");
  };

  return (
    <form className="flex flex-col space-y-4 " onSubmit={handleAddTodo}>
      <label htmlFor="todo" className="sr-only">
        {"입력"}
      </label>
      <input
        className="px-4 py-2 bg-neutral-100  outline-none  rounded-md"
        id="todo"
        value={todo}
        onChange={handleChange}
        placeholder="할 일을 입력하세요"
      />
      <button
        className="px-4 py-2 text-white rounded-md bg-blue-400"
        type="submit"
        onClick={handleAddTodo}
      >
        {"생성하기"}
      </button>
    </form>
  );
};

export default Form;
