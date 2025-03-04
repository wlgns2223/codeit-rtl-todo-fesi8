import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../src/app/page";
import User from "@testing-library/user-event";
import { fetchAllTodos, saveToCloud } from "../src/lib/storage-api";

jest.mock("../src/lib/storage-api");

describe("page test suites", () => {
  const getTimeSpy = jest.spyOn(Date.prototype, "getTime");
  getTimeSpy.mockReturnValue(1);

  const alertSpy = jest.spyOn(window, "alert");

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.mocked(fetchAllTodos).mockResolvedValue([
      {
        id: 1,
        done: false,
        todo: "todo",
      },
    ]);
  });

  it("Home 렌더링을 한다. todo가 없는 경우", async () => {
    const fetchAllTodoMock = jest.mocked(fetchAllTodos);
    fetchAllTodoMock.mockResolvedValue([]);
    render(<Home />);

    await expect(screen.findByText("todo")).rejects.toThrow();
  });

  it("Home 렌더링을 한다. todo가 있는 경우", async () => {
    render(<Home />);

    const listItem = await screen.findByRole("listitem");
    const paragraph = await screen.findByText("todo");

    expect(listItem).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });

  it("handleSaveToCloud 테스트. saveToCloud와 alert이 실행된다. ", async () => {
    render(<Home />);

    // 1. 클라우드에 저장 버튼을 찾는다.
    // 2. 해당 버튼을 누른다.
    // 3. saveToCloud와 alert이 실행이 되었는지 테스트해본다.
    // 4. saveToCloud가 1번 호출이 되었고, todos와 호출이 되었는지.
    // 5. alert가 호출이 되었는지.

    const saveToCloudButton = screen.getByRole("button", {
      name: /클라우드에 저장/,
    });

    await User.click(saveToCloudButton);

    const saveToCloudMock = jest.mocked(saveToCloud);

    expect(saveToCloudMock).toHaveBeenCalledTimes(1);
    expect(saveToCloudMock).toHaveBeenCalledWith([
      {
        id: 1,
        done: false,
        todo: "todo",
      },
    ]);
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });

  it("폼 새 투두를 입력하면 리스트에 추가가 된다", async () => {
    render(<Home />);

    // input을 찾는다.
    // 클릭을 하고, 텍스트를 입력을 한다.
    // 폼 submit 버튼을 클릭을 한다.
    // 리스트에 추가가 되었는지 확인을 한다.

    const input = screen.getByRole("textbox");
    await User.click(input);
    await User.keyboard("todo2");

    const button = screen.getByRole("button", { name: /생성/ });
    await User.click(button);

    const listItem = await screen.findAllByRole("listitem");

    expect(listItem).toHaveLength(2);
    // 1. 모듈 모킹을 하면서 넣어놨던 todo 1개
    // 2. 새로 추가한 todo 1개
  });
});
