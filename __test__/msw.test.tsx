import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Page from "../src/app/msw/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. msw@latest 설치  2.x.x
// 2. jest-fixed-jsdom 설치
// 3. jest.config.ts 파일을 만들어서 testEnvironment를 jest-fixed-jsdom으로 설정

// 1. msw가 가로채는 url
// 2. 콜백함수: 가로채는 url에 대한 응답을 설정

// handler : 요청을 처리하는 함수들
const handlers = [
  http.get("https://jsonplaceholder.typicode.com/users", () => {
    // 리턴 할 테스트 데이터 정의
    const fakeData = [
      { id: 1, name: "codeit" },
      { id: 2, name: "naver" },
      { id: 3, name: "kakao" },
    ];

    // 응답을 반환
    return HttpResponse.json(fakeData);
  }),
];

describe("msw test suites", () => {
  //   msw/node로부터 import한 setupServer 함수를 사용하여 서버를 설정
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  // 테스트환경을 위한 queryClient Provider와 함께 Page 컴포넌트를 렌더링
  const renderWithQC = () => {
    // Test 환경을 위한 QueryClient 생성
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );
  };

  it("", async () => {
    renderWithQC();

    // h1 태그글 임시로 찾음
    const listItems = await screen.findAllByRole("listitem");

    // 실제 렌더링이 어떻게되는지 확인

    listItems.forEach((listItem) => {
      expect(listItem).toBeInTheDocument();
    });
    expect(listItems).toHaveLength(3);
  });
});
