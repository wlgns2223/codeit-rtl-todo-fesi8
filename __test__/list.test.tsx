import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { Icons, List } from "../src/components/list/list";
import { TODO } from "../src/components/types";
import User from "@testing-library/user-event";

describe("list test suites", () => {
  const fakeTodos: TODO[] = [
    {
      id: 1,
      done: false,
      todo: "todo 1",
    },
    {
      id: 2,
      done: false,
      todo: "todo 2",
    },
  ];

  // 모듈 모킹
  // import되는 외부 모듈의 함수를 jest 함수로 대체함.
  // 함수의 호출, 파라미터 등을 테스트 하기 위함
  // 가짜함수로는 불가능함.

  // jest.mock("외부모듈경로", 모킹할 함수를 넣어준다.);

  // 모듈 모킹 전의 모듈
  // ({
  //   saveToStorage: 진짜 함수,
  //   fetchAllTodos: 진짜 함수,
  //   saveToCloud: 진짜 함수,
  //   fetchAllTodosFromCloud: 진짜 함수,
  // })

  // 모듈 모킹 후의 모듈
  // ({
  //   saveToStorage: jest.fn()
  // })

  const saveToStorageMock = jest.fn();
  jest.mock("../src/lib/storage-api", () => ({
    saveToStorage: saveToStorageMock,
  }));

  it("update 버튼을 누르면 todo상태업데이트를 하고 ,비동기 함수를 호출한다.", () => {
    const setTodoMock = jest.fn();
    render(<List setTodos={setTodoMock} todos={fakeTodos} />);

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach(async (list, listIndex) => {
      const button = within(list).getByRole("button", { name: /update/i });
      await User.click(button);

      const newTodos = fakeTodos.map((todo, index) => {
        if (index === listIndex) {
          return {
            ...todo,
            done: !todo.done,
          };
        }
        return todo;
      });

      expect(setTodoMock).toHaveBeenCalledWith(newTodos);
      expect(saveToStorageMock).toHaveBeenCalledWith(newTodos);
      expect(setTodoMock).toHaveBeenCalledTimes(1);
      expect(saveToStorageMock).toHaveBeenCalledTimes(1);
    });
  });

  it("icons가 todo의 done이 true이면 doneIcon이 렌더된다.", () => {
    // fake todo -> fake object
    // 일부 프로퍼티만 가지고 있는 객체 => stub

    const todoStub: Pick<TODO, "done"> = {
      done: true,
    };

    render(<Icons todo={todoStub as any} />);

    const doneIcon = screen.getByLabelText(/done/i);
    expect(doneIcon).toBeInTheDocument();
  });
  it("icons가 todo의 done이 false이면 notYet icon이 렌더된다.", () => {
    // fake todo -> fake object
    // 일부 프로퍼티만 가지고 있는 객체 => stub

    // const todoStub: Pick<TODO, "done"> = {
    //   done: false,
    // };

    // render(<Icons todo={todoStub as any} />);

    // const notYetIcon = screen.getByLabelText(/not/i);
    // expect(notYetIcon).toBeInTheDocument();

    const todoStub: Pick<TODO, "done">[] = [
      {
        done: false,
      },
      {
        done: true,
      },
    ];

    todoStub.forEach((todo) => {
      render(<Icons todo={todo as any} />);
      const icon = todo.done
        ? screen.getByLabelText(/done/i)
        : screen.getByLabelText(/not/i);
      expect(icon).toBeInTheDocument();
    });
  });

  it("ul가 있어야한다.", () => {
    render(<List setTodos={() => {}} todos={[]} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });

  it("todo 렌더링 테스트", () => {
    render(<List setTodos={() => {}} todos={fakeTodos} />);

    // p role => paragraph
    // todo 배열 = [
    // "todo 1", "todo 1" ]

    const firstParagraph = screen.getByText(fakeTodos[0].todo);
    const secondParagraph = screen.getByText(fakeTodos[1].todo);

    expect(firstParagraph).toBeInTheDocument();
    expect(secondParagraph).toBeInTheDocument();

    // 2번째 방법
    fakeTodos.forEach((todo) => {
      const p = screen.getByText(todo.todo);
      expect(p).toBeInTheDocument();
    });

    // 3번째 방법
    const listItems = screen.getAllByRole("listitem");
    // listItems = [li, li]
    listItems.forEach((list, idx) => {
      const p = within(list).getByText(fakeTodos[idx].todo);
      expect(p).toBeInTheDocument();
    });
  });

  it("button rendering 테스트", () => {
    render(<List setTodos={() => {}} todos={fakeTodos} />);

    // li 태그 하나당 update 버튼 1개, delete 버튼 1개가 있는지
    // 테스트를 해야함.

    const listItems = screen.getAllByRole("listitem");
    listItems.forEach((list) => {
      const updateButton = within(list).getByRole("button", {
        name: /update/i,
      });
      const deleteButton = within(list).getByRole("button", {
        name: /delete/i,
      });

      expect(updateButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });
});
