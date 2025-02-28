import "@testing-library/jest-dom";
import Form from "../src/components/form/form";
import { render, screen } from "@testing-library/react";
import { TODO } from "../src/components/types";
import User from "@testing-library/user-event";

describe("form test suites", () => {
  // 세부적인 로직을 없애고 감시를 함.
  // jest.mock("Date", () => ({
  //     getTime: jest.fn().mockReturnValue(1),
  // }))
  // 실제 로직이 중요하지 않을 경우

  //jest.spyOn 일종의 모킹함수
  // 세부적인 로직을 없애지않고 감시를 함.
  // 실제 로직이 필요 할 경우.
  // 모듈을 import를 하긴 해야함.
  // jest.spyOn("모듈", "함수")

  it("form handleAddTodo test", async () => {
    const handleSaveToStorageMock = jest.fn();
    const setTodoMock = jest.fn();

    // spy객체
    // jest.spyOn 원래 로직을 그대로 살려줌.

    // Date.getTime() 로직을 살려는 두지만, 리턴하는 값은 바뀜.
    const getTimeSpy = jest.spyOn(Date.prototype, "getTime");
    getTimeSpy.mockReturnValue(1);

    const newTodo: TODO = {
      done: false,
      todo: "test",
      id: 1,
    };

    render(
      <Form
        handleSaveToStorage={handleSaveToStorageMock}
        setTodos={setTodoMock}
      />
    );

    // 1. 인풋을 찾는다.
    // 2. 인풋에 "test"를 입력을 한다.
    // 3. 버튼을 찾는다.
    // 4. 버튼을 클릭한다.
    // 5. 검증

    const input = screen.getByRole("textbox");
    await User.click(input);
    await User.keyboard(newTodo.todo);

    const button = screen.getByRole("button");
    await User.click(button);

    expect(setTodoMock).toHaveBeenCalledTimes(1);
    expect(handleSaveToStorageMock).toHaveBeenCalledTimes(1);
    expect(handleSaveToStorageMock).toHaveBeenCalledWith(newTodo);
  });
});
