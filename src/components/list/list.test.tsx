import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { TODO } from "../types";
import { List } from "./list";
import User from "@testing-library/user-event";

describe("list test suite", () => {
  const renderTodos = () => {
    const todos: TODO[] = Array.from(
      { length: 5 },
      (_, i) =>
        ({
          done: false,
          id: i,
          todo: `todo ${i}`,
        } as TODO)
    );

    const setTodoMock = jest.fn();

    render(<List todos={todos} setTodos={setTodoMock} />);

    return {
      todos,
      setTodoMock,
    };
  };
  const saveToStorageMock = jest.fn();

  beforeEach(() => {
    jest.mock("../../lib/storage-api", () => ({
      saveToStorage: saveToStorageMock,
    }));
  });

  it("should render the list", () => {
    renderTodos();

    const list = screen.getByRole("list");

    expect(list).toBeInTheDocument();
  });

  it("should render the list items", () => {
    const { todos } = renderTodos();

    const listItems = screen.getAllByRole("listitem");

    expect(listItems).toHaveLength(todos.length);
  });

  it("2 button shuold be rendered in each list item", () => {
    renderTodos();

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((listItem) => {
      const buttons = within(listItem).getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });

  it("each list item shuold have data attribute", () => {
    renderTodos();

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((listItem, i) => {
      expect(listItem).toHaveAttribute("data-todo", `todo ${i}`);
    });
  });

  it("each list item shuold have todo text", () => {
    const { todos } = renderTodos();

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((listItem, i) => {
      expect(listItem).toHaveTextContent(todos[i].todo);
    });
  });

  it("should render icon component", () => {
    const { todos } = renderTodos();

    const doneIcons = screen.queryAllByLabelText("done");
    const notYetIcons = screen.queryAllByLabelText("not-yet");

    const doneTodos = todos.filter((todo) => todo.done);
    const notYetTodos = todos.filter((todo) => !todo.done);

    expect(doneIcons).toHaveLength(doneTodos.length);
    expect(notYetIcons).toHaveLength(notYetTodos.length);
  });

  it("shuold redner button text based on todo.done", () => {
    const { todos } = renderTodos();

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((listItem, i) => {
      const buttons = within(listItem).getAllByRole("button");
      const [updateButton, _] = buttons;

      expect(updateButton).toHaveTextContent(todos[i].done ? "취소" : "완료");
    });
  });

  it("should call setTodos and saveToStorage when update button is clicked", () => {
    const { setTodoMock } = renderTodos();

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach(async (listItem) => {
      const updateButton = within(listItem).getByRole("button", {
        name: "update",
      });

      await User.click(updateButton);

      expect(saveToStorageMock).toHaveBeenCalled();
      expect(setTodoMock).toHaveBeenCalled();
    });
  });
});
