import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "./form";
import { TODO } from "../types";

describe("Form test suite", () => {
  const User = userEvent.setup();
  it("input 태그가 폼에 있습니다. ", () => {
    // handleSaveTodo and setTodos are not used in the test
    // fake
    render(<Form handleSaveToStorage={async () => {}} setTodos={() => {}} />);

    const input = screen.getByRole("textbox", { name: "입력" });
    expect(input).toBeInTheDocument();
  });

  it("button 태그가 폼에 있습니다. ", () => {
    render(<Form handleSaveToStorage={async () => {}} setTodos={() => {}} />);

    const button = screen.getByRole("button", { name: "생성하기" });

    expect(button).toBeInTheDocument();
  });

  it("폼 제출시 setTodos 함수와 handleSaveToStorage 함수가 호출됩니다. ", async () => {
    const setTodosMock = jest.fn();
    const handleSaveToStorageMock = jest.fn();
    const newTodo: TODO = {
      id: 1,
      todo: "todo",
      done: false,
    };
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(newTodo.id);

    render(
      <Form
        handleSaveToStorage={handleSaveToStorageMock}
        setTodos={setTodosMock}
      />
    );

    const input = screen.getByRole("textbox", { name: "입력" });
    const button = screen.getByRole("button", { name: "생성하기" });
    await User.click(input);
    await User.type(input, newTodo.todo);
    await User.click(button);

    expect(setTodosMock).toHaveBeenCalledTimes(1);
    expect(handleSaveToStorageMock).toHaveBeenCalledTimes(1);
    expect(handleSaveToStorageMock).toHaveBeenCalledWith(newTodo);
  });
});
